var LocationTransformer = function() {

};

LocationTransformer.prototype.transform = function(location) {
    var deferred = q.defer();

    movements.findBy('location', location._id).then(function(movements) {
        location.movements = movements;
        location.totalDelay = 0;
        location.averageDelay = 0;

        for (var m in movements) {
            location.totalDelay += movements[m].timetableVariation;
        }

        location.averageDelay = location.totalDelay / movements.length;

        deferred.resolve(location);
    });

    return deferred.promise;
};

LocationTransformer.prototype.transformFromReference = function(reference) {
    return reference;
};

module.exports = new LocationTransformer;