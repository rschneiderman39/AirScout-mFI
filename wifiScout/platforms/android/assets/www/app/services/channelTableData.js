app.factory('channelTableData', ['accessPoints', 'utils',
  function(accessPoints, utils) {
    var service = {};

    service.generate = function() {
      var APData = accessPoints.getAll(),
          occupantCount = {},
          data = [];

      for (var i = 0; i < APData.length; ++i) {
        var AP = APData[i];
        for (var c = AP.channel - 2; c <= AP.channel + 2; ++c) {
          if (utils.isChannel(c)) {
            if (occupantCount[c] === undefined) {
              occupantCount[c] = 1;
            } else {
              occupantCount[c] = occupantCount[c] + 1;
            }
          }
        }
      }

      for (var ch in occupantCount) {
        data.push({
          channel: ch,
          occupancy: occupantCount[ch]
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

    return service;
  }]);
