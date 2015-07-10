<<<<<<< HEAD:wifiScout/www/app/services/signalStrengthSettingsService.js
app.factory('signalStrengthSettingsService', function() {
=======
/* Stores the settings for the performance view */
app.factory('performanceSettingsService', function() {
>>>>>>> b3e2e152276c0c0bf666b6243254c71d7ab78ae9:wifiScout/platforms/android/assets/www/app/services/performanceSettingsService.js
  var service = {},
      settings = {
        selectedBSSID: "",
        selectedSSID: "",
      };

  /* Get the BSSID of the selected AP
     @returns {String} The BSSID of the selected AP
  */
  service.getSelectedBSSID = function() {
    return settings.selectedBSSID;
  };
  /* Get the SSID of the selected AP
     @returns {String} The SSID of the selected AP
  */
  service.getSelectedSSID = function() {
    return settings.selectedSSID;
  };
  /* Set the selected BSSID
     @param {String} selected The selected BSSID
  */
  service.setSelectedBSSID = function(selected) {
    if (typeof selected === 'string') {
      settings.selectedBSSID = selected;
    }
  };
  /* Set the selected SSID
     @param {String} selected The selected SSID
  */
  service.setSelectedSSID = function(selected) {
    if (typeof selected === 'string') {
      settings.selectedSSID = selected;
    }
  };

  return service;
});
