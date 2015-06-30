app.factory('singleSpeedSettingsService', function() {
  var service = {},
      settings = {};

  settings.singleSpeed = {
    selectedBSSID = "",
    listBy = "SSID"
  };

  return service;
});
