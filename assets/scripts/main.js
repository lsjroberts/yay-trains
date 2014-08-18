var $map = $('#map')
  , width
  , height
  , projection
  , path
  , svg
  , g
  , zoom
;


projection = d3.geo.mercator()
    .center([-1.0, 51])
    .scale(40000)
    .rotate([0, 0]);

path = d3.geo.path()
    .projection(projection);

svg = d3.select('#map')
    .append('svg')

g = svg.append('g');

d3.json('uk.json', function(error, uk) {
    width = $(window).width();
    height = $(window).height();

    svg.attr('width', width).attr('height', height);

    d3.json('/locations.json', function(error, data) {
        g.selectAll('circle')
            .data(data.locations)
            .enter()
                .append('circle')
                .attr('cx', function(d) {
                    return projection([d.longitude, d.latitude])[0];
                })
                .attr('cy', function(d) {
                    return projection([d.longitude, d.latitude])[1];
                })
                .attr('r', 8)
                .attr('class', 'station')
                .on('mouseover', function(d) {
                    d3.selectAll('[data-station="'+d.locationName+'"]')
                        .classed('tooltip-visible', true);
                })
                .on('mouseout', function(d) {
                    d3.selectAll('[data-station="'+d.locationName+'"]')
                        .classed('tooltip-visible', false);
                });

        g.selectAll('.tooltip')
            .data(data.locations)
            .enter()
                .append('div')
                .attr('class', 'tooltip')
                .attr('data-station', function(d) { return d.locationName; })
                .style({
                    'left': function(d) {
                        return projection([d.longitude, d.latitude])[0];
                    },
                    'top': function(d) {
                        return projection([d.longitude, d.latitude])[1];
                    }
                })
                .append('h3')
                .text(function(d) { return d.locationName; });
    });

    g.append('path')
        .datum(topojson.feature(uk, uk.objects.subunits))
        .attr('d', path.projection(projection))
        .classed('map-land', true);
});

var scaleLevels = [
    [0, .3, 8, 'zoom-1'],
    [.3, .6, 6, 'zoom-2'],
    [.6, .9, 4, 'zoom-3'],
    [.9, 1.2, 3, 'zoom-4'],
    [1.2, 1.5, 2, 'zoom-5'],
    [1.5, 100, 1, 'zoom-6'],
];

zoom = d3.behavior.zoom()
    .on('zoom', function() {
        g.attr('transform', 'translate(' + d3.event.translate.join(',') + ')scale(' + d3.event.scale + ')');
        g.selectAll('circle')
            .attr('d', path.projection(projection));
        g.selectAll('path')
            .attr('d', path.projection(projection));
        g.selectAll('.tooltip')
            .attr('d', path.projection(projection));

        for (var i = 0, len = scaleLevels.length; i < len; i++) {
            if (d3.event.scale >= scaleLevels[i][0] && d3.event.scale < scaleLevels[i][1]) {
                g.selectAll('.station')
                    .attr('r', scaleLevels[i][2])
                    .classed(scaleLevels[i][3], true);
            } else {
                g.selectAll('.station')
                    .classed(scaleLevels[i][3], false);
            }
        }
    });

svg.call(zoom);