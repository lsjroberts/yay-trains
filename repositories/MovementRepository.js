var
    q = require('q')
  , movementTransformer = require('../transformers/MovementTransformer')
;

var MovementRepository = function(db) {
    this.db = db;
};

MovementRepository.prototype.collection = function() {
    var deferred = q.defer()
    ;

    this.db.collection('movements', function(e, movements) {
        if (e) throw e;
        deferred.resolve(movements);
    });

    return deferred.promise;
};

MovementRepository.prototype.all = function() {
    // console.log(1);
    // var promise = this.collection().then(function(collection) {
    //     console.log(2);
    //     collection.find().toArray(function(e, results) {
    //         console.log(3);
    //         if (e) throw e;
    //         promise.then(results);
    //     });
    // });

    // return promise;

    var deferred = q.defer();
    this.db.collection('movements').find().toArray(function(e, movements) {
        if (e) throw e;
        deferred.resolve(movements);
    });

    return deferred.promise;
};

MovementRepository.prototype.find = function(id) {
    return this.collection().then(function(collection) {
        collection.findOne({
            _id: id
        }, function(e, results) {
            if (e) throw e;
            return results;
        });
    });
};

MovementRepository.prototype.get = function(search) {
    // return this.all().then(...);
};

MovementRepository.prototype.create = function(message) {
    var movement = movementTransformer.transform(message);

    this.db.collection('movements').insert(movement, function(e) {
        if (e) throw e;
        console.log('[' + Date.now() + '] Created', movement);
    });
};

module.exports = MovementRepository;