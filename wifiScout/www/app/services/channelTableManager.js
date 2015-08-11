app.factory('channelTableManager', ['accessPoints', 'setupService',
function(accessPoints, setupService) {

  var service = {};

  setupService.ready.then(function() {

    var band = undefined,
        viewportExtent = undefined;

    service.getData = function() {
      var defer = $.Deferred();

      accessPoints.getAll().done(function(results) {
        var numOccupants = {},
            data = [],
            accessPoint;

        for (var i = 0; i < results.length; ++i) {
          accessPoint = results[i];

          if (numOccupants[accessPoint.channel] === undefined) {
            numOccupants[accessPoint.channel] = 1;

          } else {
            numOccupants[accessPoint.channel] += 1;
          }
        }

        for (var channel in numOccupants) {
          data.push({
            channel: channel,
            occupancy: numOccupants[channel]
          });
        }

        defer.resolve(data);
      });

      return defer;
    };


    service.getTransitionInterval = function() {
      return accessPoints.getUpdateInterval() * 0.8;
    }

    service.band = function(newBand) {
      if (newBand === undefined) {
        return band;
      } else if (newBand === '2_4' || newBand === '5') {
        band = newBand;
      }
    };

    service.viewportExtent = function(newExtent) {
      if (newExtent === undefined) {
        return viewportExtent
      } else if (newExtent instanceof Array && newExtent.length === 2) {
        viewportExtent = newExtent;
      }
    };
  });

  return service;
}]);
