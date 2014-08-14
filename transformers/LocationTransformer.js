var LocationTransformer = function() {

};

LocationTransformer.prototype.transform = function(location) {
    return location;
};

LocationTransformer.prototype.transformFromReference = function(reference) {
    return reference;
};

module.exports = new LocationTransformer;