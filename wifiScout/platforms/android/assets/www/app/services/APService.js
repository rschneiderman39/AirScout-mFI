/* Maintains current data about every AP the device can see. Each view
   should use this service whenever it wants to update its local data */
app.factory('APService', ['rawDataService', 'channelService',
  function(rawDataService, channelService) {
  var service = {},
      allAPData = [],
      minLevels = {},
      maxLevels = {},
      UPDATE_INTERVAL = 500;

  /* Get the data for every known AP
     @returns {Array} An array of AP data objects of the form:
                {
                  BSSID: <String>,
                  SSID: <String>,
                  frequency: <Number>
                  level: <Number>
                  capabilities: <String>
                }
  */
  service.getAllAPData = function() {
    return allAPData;
  };
  /* Get the data for only the APs that advertise their SSIDs
     @returns {Array} An array of AP data objects of the form:
                {
                  BSSID: <String>,
                  SSID: <String>,
                  frequency: <Number>
                  level: <Number>
                  capabilities: <String>
                }
  */
  service.getNamedAPData = function() {
    return allAPData.filter(function(ap) { return ap.SSID !== ""; });
  };

  service.getSelectedAPData = function(BSSIDs) {
    var selectedAPData = [],
        isSelected = {};
    for (var i = 0; i < BSSIDs.length; ++i) {
      isSelected[BSSIDs[i]] = true;
    }
    if (BSSIDs.length > 0) {
      for (var i = 0; i < allAPData.length; ++i) {
        if (isSelected[allAPData[i].BSSID] === true) {
          selectedAPData.push(allAPData[i]);
        }
      }
    }
    return selectedAPData;
  };

  service.getSingleAPData = function(BSSID) {
    if (BSSID !== "") {
      for (var i = 0; i < allAPData.length; ++i) {
        if (allAPData[i].BSSID === BSSID) {
          return allAPData[i];
        }
      }
    }
    return null;
  };

  var appendChannelData = function(data) {
    for (var i = 0; i < data.length; ++i) {
      data[i].channel = channelService.freqToChannel(data[i].frequency);
    }
    return data;
  };

  /* Get data from the device and update internal state accordingly */
  var update = function() {
    rawDataService.getData()
    .done(function(data) {
      allAPData = appendChannelData(data.available);
    })
    .fail(function() {
      allAPData = [];
    });
    setTimeout(update, UPDATE_INTERVAL);
  };

  /* INIT */

  /* Start the update loop */
  update();

  return service;
}]);
