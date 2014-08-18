var config = require('../config.json')

  // , rail = require('network-rail')
  , rail = require('../../node-network-rail')

  , db = require('../repositories/Database').connect(config.database.name, config.database.host, config.database.port)
  , locations = new (require('../repositories/LocationRepository'))(db);

locations.empty();

var data = rail.reference.parseReferenceFile(function(line) {
    if (line.recordType == 'LOC') {
        console.log(Date.now(), line.locationName);
        locations.createFromReference(line);
    }
});