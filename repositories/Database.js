var mongo = require('mongodb')
  , q = require('q')
;

var Database = function() {

};

Database.prototype.connect = function(name, host, port) {
    var connection = new mongo.Db(name, new mongo.Server(host, port, {auto_reconnect: true, w: 0}, {}))
      , deferred = q.defer()
    ;

    connection.open(function(e, db) {
        if (e) throw e;
        deferred.resolve(db);
    });

    connection.on('close', function() {
        // console.log('closed');
    });

    return deferred.promise;
}

module.exports = new Database;