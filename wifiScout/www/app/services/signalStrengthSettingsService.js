app.factory('signalStrengthSettingsService', function() {
  var service = {},
      _settings = {
        selectedBSSID: "",
        selectedSSID: "",
      };

  service.getSelectedBSSID = function() {
    return _settings.selectedBSSID;
  };
  service.getSelectedSSID = function() {
    return _settings.selectedSSID;
  };
  service.setSelectedBSSID = function(selected) {
    if (typeof selected === 'string') {
      _settings.selectedBSSID = selected;
    }
  };
  service.setSelectedSSID = function(selected) {
    if (typeof selected === 'string') {
      _settings.selectedSSID = selected;
    }
  };

  return service;
});
