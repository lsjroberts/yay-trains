var mongo = require('mongodb');

var Database = function() {

};

Database.prototype.connect = function(name, host, port) {
    var connection = new mongo.Db(name, new mongo.Server(host, port, {auto_reconnect: true, w: 0}, {}));

    connection.open(function(e, db) {
        if (e) throw e;
    });

    connection.on('close', function() {
        // console.log('closed');
    });

    return connection;
}

module.exports = new Database;