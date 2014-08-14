var
    q = require('q')
  , locationTransformer = require('../transformers/LocationTransformer')
  // , __extends = require('extends')
;

var LocationRepository = function(db) {
    this.db = db;
    // __extends(LocationRepository, Repository);
}

LocationRepository.prototype.all = function() {
    var deferred = q.defer();
    this.db.collection('locations').find().toArray(function(e, locations) {
        if (e) throw e;
        deferred.resolve(locations);
    });

    return deferred.promise;
};

LocationRepository.prototype.empty = function() {
    this.db.collection('locations').remove({});
};

LocationRepository.prototype.findByStanox = function(stanox) {
    var deferred = q.defer();

    this.db.collection('locations').findOne({
        stanox: stanox
    }, function(e, results) {
        if (e) throw e;
        deferred.resolve(results);
    });

    return deferred.promise;
};

LocationRepository.prototype.createFromStanox = function(stanox) {

};

LocationRepository.prototype.createFromReference = function(reference) {
    var location = locationTransformer.transformFromReference(reference);

    this.db.collection('locations').insert(location, function(e) {
        if (e) throw e;
        console.log('[' + Date.now() + '] Created', location.locationName);
    });

    // this.db.collection('locations').count(function(e) {
    //     if (e) throw e;
    // });
};

module.exports = LocationRepository;