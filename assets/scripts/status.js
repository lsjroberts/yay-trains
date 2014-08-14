require(['zepto', 'underscore'], function($, _) {
    var $statusContainer
      , statuses = {}
      , movementInterval
    ;

    function getMovements() {
        $.get('/api/0.1/movements', function(response) {
            var statusHtml
              , movements;

            movements = response.movements;

            for (var i = 0, len = movements.length; i < len; i++) {
                statuses[movements[i].trainID] = {
                    movement: movement,
                    updatedAt: new Date();
            }

            _.filter(statuses, function(status) {
                return status.updatedAt > (new Date('?? 15 mins ago'));
            })

            for (var i = 0, len = statuses.length; i < len; i++) {
                statusHtml += ??buildFromTemplate('partial/status/train', movements[i]);
            }

            $statusContainer.html(statusHtml);
        }).fail(function(response) {

        });
    }

    movementInterval = setInterval(getMovements, 15);
});