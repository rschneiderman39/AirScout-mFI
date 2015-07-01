app.factory('singleSpeedSettingsService', function() {
  var service = {},
      _settings = {
        selectedBSSID: "",
        listBy: "SSID"
      };

  service.getSelectedBSSID = function() {
    return _settings.selectedBSSID;
  };
  service.setSelectedBSSID = function(selected) {
    if (typeof selected === 'string') {
      _settings.selectedBSSID = selected;
    }
  };

  return service;
});
