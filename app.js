var
    express = require('express')
  , app = express()

  // , rail = require('network-rail')
  , rail = require('../node-network-rail')

  , repositories = {
        movements: new (require('./repositories/MovementRepository'))('localhost', 27017)
    }
  , config = require('./config.json')
;

// Config
app.set('views', __dirname + '/views/');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

// static assets
app.use('/styles', express.static(__dirname + '/build/styles'));
app.use('/scripts', express.static(__dirname + '/build/scripts'));

// Rail
rail.feeds.connect(config.networkrail.username, config.networkrail.password);
rail.feeds.listen(rail.feeds.topics.movements.all, null, function(body, headers) {
    body.forEach(function(message) {
        repositories.movements.create(message);
    });
});

// Routes
app.get('/', function(req, res) {
    // repositories.movements.all().then(function(movements) {
        res.render('index.jade', {
            // movements: movements
        });
    // });
});

// Exit hook
process.on('exit', function() {
    rail.feeds.disconnect();
})

// Server
server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});