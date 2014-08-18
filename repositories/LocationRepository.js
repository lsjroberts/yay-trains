var
    q = require('q')
  , locationTransformer = require('../transformers/LocationTransformer')
  // , __extends = require('extends')
;

var LocationRepository = function(connection) {
    this.connection = connection;
    // __extends(LocationRepository, Repository);
}

LocationRepository.prototype.empty = function() {
    this.connection.then(function(db) {
        db.collection('locations').remove({});
    });
};

LocationRepository.prototype.all = function() {
    var deferred = q.defer();

    this.connection.then(function(db) {
        db.collection('locations').find().toArray(function(e, locations) {
            if (e) throw e;
            deferred.resolve(locations);
        });
    });

    return deferred.promise;

    // return deferred.promise.then(function(locations) {
    //     locations.forEach(function(location) {
    //         // programatically chain promises to transform each location
    //     });
    // });
};

LocationRepository.prototype.findBy = function(property, value) {
    var deferred = q.defer();

    this.connection.then(function(db) {
        db.collection('locations').find({
            property: value
        }, function(e, results) {
            if (e) throw e;
            deferred.resolve(results);
        });
    });

    return deferred.promise;
};

LocationRepository.prototype.findByStanox = function(stanox) {
    var deferred = q.defer();

    this.connection.then(function(db) {
        db.collection('locations').findOne({
            stanox: stanox
        }, function(e, results) {
            if (e) throw e;
            deferred.resolve(results);
        });
    });

    return deferred.promise;
};

LocationRepository.prototype.createFromStanox = function(stanox) {

};

LocationRepository.prototype.createFromReference = function(reference) {
    var location = locationTransformer.transformFromReference(reference);

    this.connection.then(function(db) {
        db.collection('locations').insert(location, function(e) {
            if (e) throw e;
            console.log('[' + Date.now() + '] Created', location.locationName);
        });

        db.collection('locations').count(function(e) {
            if (e) throw e;
        });
    });
};

module.exports = LocationRepository;