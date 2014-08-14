var margin = {top: 10, right: 10, bottom: 10, left: 10}
  , width = 960 - margin.left - margin.right
  , height = 600 - margin.top - margin.bottom
  , data
  , map
  , svg
  , x
  , y
  , line
  , lineUp
  , lineDown
  , minLat
  , maxLat
  , minLon
  , maxLon
  , domainLat
  , domainLon
;

data = [
    {name: "Hove",            lat: 50.835214, lon: -0.170787, size: 2},
    {name: "Burgess Hill",    lat: 50.953611, lon: -0.127738, size: 1},
    {name: "Haywards Heath",  lat: 51.005272, lon: -0.105336, size: 3},
    {name: "Three Bridges",   lat: 51.116935, lon: -0.161211, size: 3},
    {name: "Gatwick Airport", lat: 51.156466, lon: -0.161040, size: 2},
    {name: "East Croydon",    lat: 51.375462, lon: -0.092751, size: 4},
    {name: "London Bridge",   lat: 51.505132, lon: -0.086024, size: 5},
];

for (var i in data) {
    if (minLat == null || data[i].lat < minLat) minLat = data[i].lat;
    if (maxLat == null || data[i].lat > maxLat) maxLat = data[i].lat;
    if (minLon == null || data[i].lon < minLon) minLon = data[i].lon;
    if (maxLon == null || data[i].lon > maxLon) maxLon = data[i].lon;
}

if (Math.abs(maxLon - minLon) > Math.abs(maxLat - minLat)) {
    domainLon = [minLon, maxLon];
    domainLat = [minLat, maxLat + (Math.abs(maxLon - minLon) - Math.abs(maxLat - minLat))];
} else {
    domainLon = [minLon, maxLon + (Math.abs(maxLat - minLat) - Math.abs(maxLon - minLon))];
    domainLat = [minLat, maxLat];
}

x = d3.scale.linear()
    .domain(domainLon)
    .range([margin.left, width]);

y = d3.scale.linear()
    .domain(domainLat)
    .range([height, margin.top]);

line = function(points, direction) {
var i = 0
      , n = points.length
      , p = points[0]
      , path = [ p[0], ",", p[1] ]
      , dx
      , dy
      , dirMod
    ;

    dirMod = (direction == "up") ? -2 : 2;

    while (++i < n) {
        dx = Math.abs(points[i][0] - p[0]);
        dy = Math.abs(points[i][1] - p[1]);

        // If the line is going horizontal
        if (Math.abs(dx) > Math.abs(dy)) {
            path.push("L", points[i][0] + dy, p[1]);
            path.push("L", points[i][0], points[i][1]);
        }
        // else the line is going vertical
        else {
            path.push("L", p[0], points[i][1] + dx);
            path.push("L", points[i][0], points[i][1]);
        }

        p = points[i];
    }

    return path.join(" ");
}

lineUp = d3.svg.line()
    .interpolate(function(points) {
        return line(points, "up");
    })
    .x(function(d) { return x(d.lon); })
    .y(function(d) { return y(d.lat); })

lineDown = d3.svg.line()
    .interpolate(function(points) {
        return line(points, "down");
    })
    .x(function(d) { return x(d.lon); })
    .y(function(d) { return y(d.lat); })

map = d3.select('#map');
svg = map.append('svg')
    .datum(data)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

svg.append('path')
    .classed('line', true)
    .classed('line-up', true)
    .attr('d', lineUp);

svg.append('path')
    .classed('line', true)
    .classed('line-down', true)
    .attr('d', lineDown);

circle = svg.selectAll('circle')
    .data(data)
  .enter().append('circle')
    .attr('class', 'station')
    .attr('cx', line.x())
    .attr('cy', line.y())
    .attr('r', function(d) { return 4 + d.size; })
    .on('mouseover', function(d) {
        d3.selectAll('[data-station="'+d.name+'"]')
            .classed('tooltip-visible', true);
    })
    .on('mouseout', function(d) {
        d3.selectAll('[data-station="'+d.name+'"]')
            .classed('tooltip-visible', false);
    });

map.selectAll('.tooltip')
    .data(data)
  .enter().append('div')
    .attr('class', 'tooltip')
    .attr('data-station', function(d) { return d.name; })
    .style({
        'left': function(d) { return (line.x()(d) + 20) + 'px'; },
        'top':  function(d) { return (line.y()(d) - 20) + 'px'; },
    })
    .append('h3').text(function(d) { return d.name; });