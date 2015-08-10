/* Maintains current data about every AP the device can see. Each view
   should use this service whenever it wants to update its local data */
app.factory('accessPoints', ['networkData', 'globalSettings', 'setupService',
function(networkData, globalSettings, setupService) {

  var service = {};

  setupService.ready.then(function() {

    var updateInterval = 2000;

    var accessPoints = [],
        lineColors = {};

    var inBand = utils.inBand,
        freqToChannel = utils.freqToChannel,
        getRandomColor = utils.getRandomColor;

    service.getAll = function() {
      return accessPoints;
    };

    service.getAllInBand = function(band) {
      var accessPointsInBand = [];

      for (var i = 0; i < accessPoints.length; ++i) {
        if (inBand(accessPoints[i], band)) {
          accessPointsInBand.push(accessPoints[i]);
        }
      }

      return accessPointInBand;
    }

    service.getSelected = function(BSSIDs) {
      var selectedAccessPoints = [],
          isSelected = {};
      for (var i = 0; i < BSSIDs.length; ++i) {
        isSelected[BSSIDs[i]] = true;
      }
      if (BSSIDs.length > 0) {
        for (var i = 0; i < accessPoints.length; ++i) {
          if (isSelected[accessPoints[i].BSSID] === true) {
            selectedAccessPoints.push(accessPoints[i]);
          }
        }
      }
      return selectedAccessPoints;
    };

    service.getUpdateInterval = function() {
      return updateInterval;
    }

    service.count = function() {
      return accessPoints.length;
    }

    service.get = function(BSSID) {
      if (BSSID !== "") {
        for (var i = 0; i < accessPoints.length; ++i) {
          if (accessPoints[i].BSSID === BSSID) {
            return accessPoints[i];
          }
        }
      }
      return null;
    };

    var markHidden = function(data) {
      for (var i = 0; i < data.length; ++i) {
        if (data[i].SSID === "") {
          data[i].SSID = "<hidden>";
        }
      }
      return data;
    };

    var removeHidden = function(data) {
      return data.filter(function(ap) {
        return ap.SSID !== "";
      });
    };

    var appendChannels = function(data) {
      for (var i = 0; i < data.length; ++i) {
        data[i].channel = freqToChannel(data[i].frequency);
      }
      return data;
    };

    var appendColors = function(data) {
      for (var i = 0; i < data.length; ++i) {
        var lineColor = lineColors[data[i].BSSID];
        if (lineColor === undefined) {
          lineColor = getRandomColor();
          lineColors[data[i].BSSID] = lineColor;
        }
        data[i].color = lineColor;
      }
      return data;
    };

    var appendManufacturer = function(data) {
      for (var i = 0; i < data.length; ++i) {
        data[i].manufacturer = utils.macToManufacturer(data[i].BSSID);
      }
      return data;
    };

    /* Get data from the device and update internal state accordingly */
    var update = function() {
      if (! globalSettings.updatesPaused()) {
        networkData.get()
        .done(function(data) {
          if (globalSettings.detectHidden()) {
            APData = appendManufacturer(appendColors(appendChannels(markHidden(data.available))));
          } else {
            APData = appendManufacturer(appendColors(appendChannels(removeHidden(data.available))));
          }
        })
        .fail(function() {
          accessPoints = [];
        });

        document.dispatchEvent(new Event(events.newAccessPointData));
      }
      setTimeout(update, updateInterval);
    };

    var init = function() {
      update();
    };

    init();

  });

  return service;

}]);
