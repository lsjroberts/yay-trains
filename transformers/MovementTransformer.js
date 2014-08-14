var q = require('q')
  , config = require('../config.json')
  , db = require('../repositories/Database').connect(config.database.name, config.database.host, config.database.port)
  , locations = new (require('../repositories/LocationRepository'))(db);

var MovementTransformer = function() {

};

MovementTransformer.prototype.transform = function(movement) {
    var deferred = q.defer();

    movement.actualAt = this.timestampToDate(movement.timestamp);
    movement.plannedAt = this.timestampToDate(movement.plannedTimestamp);

    locations.findByStanox(movement.stanox)
      .then(function(location) {
        movement.location = location;
        return locations.findByStanox(movement.nextStanox);
    }).then(function(location) {
        movement.nextLocation = location;
        deferred.resolve(movement);
    })

    return deferred.promise;
};

MovementTransformer.prototype.messageType = function(type) {
    return type;
}

MovementTransformer.prototype.eventType = function(type) {
    return type;
}

MovementTransformer.prototype.timestampToDate = function(timestamp) {
    return new Date(Math.floor(timestamp));
}

module.exports = new MovementTransformer;