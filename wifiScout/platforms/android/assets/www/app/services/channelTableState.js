app.factory('channelTableState', ['accessPoints', 'setupService',
function(accessPoints, setupService) {

  var service = {};

  setupService.ready.then(function() {

    var band = undefined,
        viewportExtent = undefined;

    service.getData = function() {
      var allAccessPoints = accessPoints.getAll(),
          numOccupants = {},
          data = [];

      for (var i = 0; i < allAccessPoints.length; ++i) {
        var accessPoint = allAccessPoints[i];
        if (numOccupants[accessPoint.channel] === undefined) {
          numOccupants[accessPoint.channel] = 1;
        } else {
          numOccupants[accessPoint.channel] += 1;
        }
      }

      for (var ch in numOccupants) {
        data.push({
          channel: ch,
          occupancy: numOccupants[ch]
        });
      }

      return data;
    };

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
