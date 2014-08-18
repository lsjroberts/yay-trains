var
    express = require('express')
  , app = express()
  , _ = require('underscore')
  , io = require('socket.io').listen(3001)
  , sockets = []

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

io.sockets.on('connection', function(socket) {
    sockets.push(socket);
    socket.emit('connected');
});

// Config
app.set('views', __dirname + '/views/');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

// static assets
app.use('/styles', express.static(__dirname + '/build/styles'));
app.use('/scripts', express.static(__dirname + '/build/scripts'));

// Rail
rail.feeds.connect(config.networkrail.username, config.networkrail.password);
rail.movements.listen(function(movements) {
    movements.forEach(function(movement) {
        repositories.movements.create(movement).then(function(movement) {
            for (var i = 0, len = sockets.length; i < len; i++) {
                sockets[i].emit('movement', movement);
            }
        });
    });
});

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

// Companies
app.get('/companies', function(req, res) {
    tocs = rail.reference.tocCodes;
    companies = [];

    db.then(function(connection) {
        connection.collection('movements').aggregate({
            $group: {
                _id: "$company",
                // name: { "$company",
                count: { $sum: 1 },
                totalVariation: { $sum: "$timetableVariation" },
                averageVariation: { $avg: "$timetableVariation" }
            }
        }, function(e, companies) {
            var maxCount = 1;

            companies.forEach(function(company) {
                if (company.count > maxCount) {
                    maxCount = company.count;
                }
            });

            companies.forEach(function(company) {
                company.activityRank = company.count / maxCount;

                if (isNaN(company.averageVariation)) {
                    company.averageVariation = 0;
                }
            });

            companies.sort(function(a, b) {
                if (a.averageVariation == b.averageVariation) return 0;
                return (a.averageVariation < b.averageVariation) ? 1 : -1;
            });

            res.render('companies.jade', {
                companies: companies
            });
        });
    });

    // db.then(function(connection) {
    //     connection.movements.group({
    //         key: 'company',
    //         reduce: function(c, r) {
    //             r.company = c.company;
    //             r.count++;
    //             r.totalVariation += Number(c.timetableVariation);
    //             r.averageVariation = r.totalVariation / r.count;
    //         },
    //         initial: {
    //             company: '',
    //             count: 0,
    //             totalVariation: 0,
    //             averageVariation: 0
    //         }
    //     }, function(companies) {
    //         console.log(companies);

    //         res.render('companies.jade', {
    //             companies: companies
    //         });
    //     });
    // });
})

// Locations
app.get('/locations', function(req, res) {
    repositories.locations.all().then(function(locations) {
        /*
        for (var i = 0, len = locations.length; i < len; i++) {
            locations[i].movements = repositories.movements.get().find({
                stanox: locations[i].stanox
            });

            for (var j = 0, lenj = locations[i].movements.length; j < lenj; j++) {
                locations[i].totalVariation += locations[i].movements[j].timetableVariation;
            }

            locations[i].averageVariation = locations[i].totalVariation / lenj;
        }

        locations = _.filter(locations, function(location) {
            return location.averageVariation > 0;
        });
        */



        res.render('locations.jade', {
            locations: locations
        });
    });
});

app.get('/locations.json', function(req, res) {
    repositories.locations.all().then(function(locations) {
        locations = _.filter(locations, function(location) {
            return location.osEasting != "0"
                && location.osEasting != "999999"
                && location.osNorthing != "0"
                && location.osNorthing != "999999"
                && location.offNetwork == false
                && location.stanox != null
                // && location.alpha3 != null
                // && location.timingPointType == "T"
                // && location.forceLPB != null
        });

        res.json({
            locations: locations
        });
    });
});

app.get('/uk.json', function(req, res) {
    res.json(require('./data/uk.json'));
})

// Exit hook
process.on('exit', function() {
    rail.feeds.disconnect();
})

// Server
server = app.listen(3002, function() {
    console.log('Listening on port %d', server.address().port);
});