var
    q = require('q')
  , mongo = require('mongodb')
;

var MovementRepository = function(host, port) {
    this.db = new mongo.Db('node-mongo-network-rail', new mongo.Server(host, port, {auto_reconnect: true}, {}));
    this.db.open(function(e, db) {
        if (e) throw e;

        // temp clear out movements
        db.collection('movements').remove();
    });
    this.db.on('close', function() {
        // console.log('closed');
    });
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
    this.db.collection('movements').insert(message, function(e) {
        if (e) throw e;
        console.log('Created', message);
    });
};

module.exports = MovementRepository;