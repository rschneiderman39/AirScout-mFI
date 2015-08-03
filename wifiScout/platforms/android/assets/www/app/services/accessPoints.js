/* Maintains current data about every AP the device can see. Each view
   should use this service whenever it wants to update its local data */
app.factory('accessPoints', ['networkData', 'globalSettings', 'setupService',
function(networkData, globalSettings, setupService) {

  var prefs = {
    updateInterval: 1000
  };

  var service = {};

  setupService.ready.then(function() {
    var APData = [];

    service.getAll = function() {
      return APData;
    };

    service.getSelected = function(BSSIDs) {
      var selectedAPData = [],
          isSelected = {};
      for (var i = 0; i < BSSIDs.length; ++i) {
        isSelected[BSSIDs[i]] = true;
      }
      if (BSSIDs.length > 0) {
        for (var i = 0; i < APData.length; ++i) {
          if (isSelected[APData[i].BSSID] === true) {
            selectedAPData.push(APData[i]);
          }
        }
      }
      return selectedAPData;
    };

    service.get = function(BSSID) {
      if (BSSID !== "") {
        for (var i = 0; i < APData.length; ++i) {
          if (APData[i].BSSID === BSSID) {
            return APData[i];
          }
        }
      }
      return null;
    };

    var lineColors = {};

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
        data[i].channel = utils.freqToChannel(data[i].frequency);
      }
      return data;
    };

    var appendColors = function(data) {
      for (var i = 0; i < data.length; ++i) {
        var lineColor = lineColors[data[i].BSSID];
        if (lineColor === undefined) {
          lineColor = utils.getRandomColor();
          lineColors[data[i].BSSID] = lineColor;
        }
        data[i].color = lineColor;
      }
      return data;
    };

    /* Get data from the device and update internal state accordingly */
    var update = function() {
      networkData.get()
      .done(function(data) {
        if (globalSettings.detectHidden()) {
          APData = appendColors(appendChannels(markHidden(data.available)));
        } else {
          APData = appendColors(appendChannels(removeHidden(data.available)));
        }
      })
      .fail(function() {
        APData = [];
      });
      setTimeout(update, prefs.updateInterval);
    };

    update();

  });

  return service;

}]);
