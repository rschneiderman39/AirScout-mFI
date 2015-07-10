/* Maintains current data about every AP the device can see. Each view
   should use this service whenever it wants to update its local data */
app.factory('APService', ['rawDataService', function(rawDataService) {
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
  /* Get the minimum measured RSSI for a particular AP
     @param {String} BSSID - The hardware address of the AP
     @returns {Number} The minimum RSSI of the AP
  */
  service.getMinLevel = function(BSSID) {
    var minLevel = minLevels[BSSID];
    if (typeof minLevel !== 'undefined') {
      return minLevel;
    } else {
      return -100;
    }
  };
  /* Get the maximum measured RSSI for a particular AP
     @param {String} BSSID - The hardware address of the AP
     @returns {Number} The maximum RSSI of the AP
  */
  service.getMaxLevel = function(BSSID) {
    var maxLevel = maxLevels[BSSID];
    if (typeof maxLevel !== 'undefined') {
      return maxLevel;
    } else {
      return -100;
    }
  };

  /* Iterate through the current batch of AP data and update minimum levels */
  var updateMinLevels = function() {
    for (var i = 0; i < allAPData.length; ++i) {
      var ap = allAPData[i];
      var minLevel = minLevels[ap.BSSID];
      if (typeof minLevel !== 'undefined') {
        if (ap.level < minLevel) {
          minLevels[ap.BSSID] = ap.level;
        }
      } else {
        minLevels[ap.BSSID] = ap.level;
      }
    }
  };

  /* Iterate through the current batch of AP data and update maximum levels */
  var updateMaxLevels = function() {
    for (var i = 0; i < allAPData.length; ++i) {
      var ap = allAPData[i];
      var maxLevel = maxLevels[ap.BSSID];
      if (typeof maxLevel !== 'undefined') {
        if (ap.level > maxLevel) {
          maxLevels[ap.BSSID] = ap.level;
        }
      } else {
        maxLevels[ap.BSSID] = ap.level;
      }
    }
  };

  /* Get data from the device and update internal state accordingly */
  var update = function() {
    rawDataService.getData()
    .done(function(data) {
      allAPData = data.available;
      updateMinLevels();
      updateMaxLevels();
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
