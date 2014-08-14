// require(['zepto', 'handlerbars'], function($, Handlebars) {
;(function() {
    var $movementContainer
      , movementTemplateSource
      , movementTemplate
      , socket
    ;

    $movementContainer = $('.movements');

    movementTemplateSource = $('script#movementTemplate').html();
    movementTemplate = Handlebars.compile(movementTemplateSource);

    socket = io.connect('http://10.192.54.48:3001');
    socket.on('movement', function(movement) {
        var movementHtml;

        movement.actualAt = (new Date(movement.actualAt)).toUTCString();
        movement.plannedAt = (new Date(movement.plannedAt)).toUTCString();

        movementHtml = movementTemplate({
            movement: movement
        });
        $movementContainer.prepend(movementHtml);
    })
})();
// });