/* Maintains current data about every AP the device can see. Each view
   should use this service whenever it wants to update its local data */
app.factory('APService', ['rawDataService', function(rawDataService) {
  var service = {},
      _allAPData = [],
      _minLevels = {},
      _maxLevels = {},
      _UPDATE_INTERVAL = 100;

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
    return _allAPData;
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
    return _allAPData.filter(function(ap) { return ap.SSID !== ""; });
  };
  /* Get the minimum measured RSSI for a particular AP
     @param {String} BSSID - The hardware address of the AP
     @returns {Number} The minimum RSSI of the AP
  */
  service.getMinLevel = function(BSSID) {
    var minLevel = _minLevels[BSSID];
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
    var maxLevel = _maxLevels[BSSID];
    if (typeof maxLevel !== 'undefined') {
      return maxLevel;
    } else {
      return -100;
    }
  };

  /* Iterate through the current batch of AP data and update minimum levels */
  var _updateMinLevels = function() {
    for (var i = 0; i < _allAPData.length; ++i) {
      var ap = _allAPData[i];
      var minLevel = _minLevels[ap.BSSID];
      if (typeof minLevel !== 'undefined') {
        if (ap.level < minLevel) {
          _minLevels[ap.BSSID] = ap.level;
        }
      } else {
        _minLevels[ap.BSSID] = ap.level;
      }
    }
  };

  /* Iterate through the current batch of AP data and update maximum levels */
  var _updateMaxLevels = function() {
    for (var i = 0; i < _allAPData.length; ++i) {
      var ap = _allAPData[i];
      var maxLevel = _maxLevels[ap.BSSID];
      if (typeof maxLevel !== 'undefined') {
        if (ap.level > maxLevel) {
          _maxLevels[ap.BSSID] = ap.level;
        }
      } else {
        _maxLevels[ap.BSSID] = ap.level;
      }
    }
  };

  /* Get data from the device and update internal state accordingly */
  var _update = function() {
    rawDataService.getData()
    .done(function(data) {
      _allAPData = data.available;
      _updateMinLevels();
      _updateMaxLevels();
    })
    .fail(function() {
      _allAPData = [];
    });
    setTimeout(_update, _UPDATE_INTERVAL);
  };

  /* INIT */

  /* Start the update loop */
  _update();

  return service;
}]);
