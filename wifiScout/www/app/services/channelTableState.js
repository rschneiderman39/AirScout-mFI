angApp.factory('channelTableState', ['accessPoints', 'setupService',
function(accessPoints, setupService) {

  var service = {};

  setupService.ready.then(function() {
    service.getData = function() {
      var APData = accessPoints.getAll(),
          numOccupants = {},
          data = [];

      for (var i = 0; i < APData.length; ++i) {
        var AP = APData[i];
        if (numOccupants[AP.channel] === undefined) {
          numOccupants[AP.channel] = 1;
        } else {
          numOccupants[AP.channel] += 1;
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
      } else if (newBand === '2_4Ghz' || newBand === '5Ghz') {
        band = newBand;
      }
    };

    service.sliderExtent = function(newExtent) {
      if (newExtent === undefined) {
        return sliderExtent
      } else if (newExtent instanceof Array && newExtent.length === 2) {
        sliderExtent = newExtent;
      }
    };

    service.getDomain = function(band) {
      return domain[band];
    };

    service.getRange = function() {
      return range;
    };

    var band = '2_4Ghz',
        domain = {
          '2_4Ghz': [-1, 15],
          '5Ghz': [34, 167]
        },
        range = [0, 15],
        sliderExtent = [34, 66];

  });

  return service;
}]);
