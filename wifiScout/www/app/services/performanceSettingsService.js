/* Stores the settings for the performance view */
app.factory('performanceSettingsService', function() {
  var service = {},
      _settings = {
        selectedBSSID: "",
        selectedSSID: "",
      };

  /* Get the BSSID of the selected AP
     @returns {String} The BSSID of the selected AP
  */
  service.getSelectedBSSID = function() {
    return _settings.selectedBSSID;
  };
  /* Get the SSID of the selected AP
     @returns {String} The SSID of the selected AP
  */
  service.getSelectedSSID = function() {
    return _settings.selectedSSID;
  };
  /* Set the selected BSSID
     @param {String} selected The selected BSSID
  */
  service.setSelectedBSSID = function(selected) {
    if (typeof selected === 'string') {
      _settings.selectedBSSID = selected;
    }
  };
  /* Set the selected SSID
     @param {String} selected The selected SSID
  */
  service.setSelectedSSID = function(selected) {
    if (typeof selected === 'string') {
      _settings.selectedSSID = selected;
    }
  };

  return service;
});
