var
    express = require('express')
  , app = express()

  , config = require('./config.json')

  // , rail = require('network-rail')
  , rail = require('../node-network-rail')
  , db = require('./repositories/Database').connect(config.database.name, config.database.host, config.database.port)
  , repositories = {
        locations: new (require('./repositories/LocationRepository'))(db),
        movements: new (require('./repositories/MovementRepository'))(db),
        // trains: new (require('./repositories/TrainRepository'))(db)
    }
;

// Config
app.set('views', __dirname + '/views/');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

// static assets
app.use('/styles', express.static(__dirname + '/build/styles'));
app.use('/scripts', express.static(__dirname + '/build/scripts'));

// Rail
// rail.feeds.connect(config.networkrail.username, config.networkrail.password);
// rail.feeds.listen(rail.feeds.topics.movements.all, null, function(body, headers) {
//     body.forEach(function(message) {
//         repositories.movements.create(message);
//     });
// });
// rail.movements.listen(function(movements) {
//     console.log(movements);
// });


// Routes
app.get('/', function(req, res) {
    repositories.movements.all().then(function(movements) {
        res.render('index.jade', {
            // movements: movements
        });
    });
});

// Stream
app.get('/stream', function(req, res) {
    res.render('stream.jade', {

    });
});

// Status
app.get('/status', function(req, res) {
    res.render('status.jade', {

    });
});

// Locations
app.get('/locations', function(req, res) {
    repositories.locations.all().then(function(locations) {
        res.render('locations.jade', {
            locations: locations
        });
    });
});

// Exit hook
process.on('exit', function() {
    rail.feeds.disconnect();
})

// Server
server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});