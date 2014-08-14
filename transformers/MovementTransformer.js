var locations = require('../repositories/LocationRepository');

var MovementTransformer = function() {

};

MovementTransformer.prototype.transform = function(movement) {
    return {
        'messageType': this.messageType(movement.header.msg_type),
        'eventType': this.eventType(movement.body.event_type),
        'trainID': movement.body.train_id,
        'plannedAt': this.timestampToDateTime(movement.body.planned_timestamp),
        'actualAt': this.timestampToDateTime(movement.body.actual_timestamp),
        'location': this.stanoxToLocation(movement.body.loc_stanox),
        'nextLocation': this.stanoxToLocation(movement.body.next_report_stanox),
    };
};

MovementTransformer.prototype.messageType = function(type) {
    return type;
}

MovementTransformer.prototype.eventType = function(type) {
    return type;
}

MovementTransformer.prototype.timestampToDateTime = function(timestamp) {
    return timestamp;
}

MovementTransformer.prototype.stanoxToLocation = function(stanox) {
    var location;

    if (location = locations.findByStanox(stanox)) {
        console.log('Found', location);
        return location;
    }

    console.log('Create', stanox);
    return locations.createFromStanox(stanox);
}

module.exports = new MovementTransformer;