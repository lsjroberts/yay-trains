var
    q = require('q')
  , movementTransformer = require('../transformers/MovementTransformer')
;

var MovementRepository = function(connection) {
    this.connection = connection;
};

MovementRepository.prototype.all = function() {
    var deferred = q.defer();

    this.connection.then(function(db) {
        db.collection('movements').find().toArray(function(e, movements) {
            if (e) throw e;
            deferred.resolve(movements);
        });
    });

    return deferred.promise;
};

MovementRepository.prototype.find = function(id) {
    this.connection.then(function(db) {
        db.collection('movements').findOne({
            _id: id
        }, function(e, results) {
            if (e) throw e;
            return results;
        });
    });
};

MovementRepository.prototype.findBy = function(property, value) {
    var deferred = q.defer();

    this.connection.then(function(db) {
        db.collection('movement').find({
            property: value
        }, function(e, results) {
            if (e) throw e;
            deferred.resolve(results);
        });
    });

    return deferred.promise;
};

MovementRepository.prototype.get = function(search) {
    return this.connection.then(function(db) {
        return db.collection('movements');
    });
};

MovementRepository.prototype.create = function(movement) {
    var self = this
      , deferred = q.defer()
    ;

    self.connection.then(function(db) {
        db.collection('movements').insert(movement, function(e) {
            if (e) throw e;
            deferred.resolve(movement);
            console.log('[' + Date.now() + '] Created', movement.trainID);
        });
    });

    return deferred.promise.then(function(movement) {
        return movementTransformer.transform(movement);
    });
};

module.exports = MovementRepository;