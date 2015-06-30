// Gets AP info from the device.
app.factory('rawDataService', function() {
  var service = {};

  service.getInfo = function() {
    var defer = $.Deferred();
    // force a scan
    window.plugins.WifiAdmin.scan();
    // grab the data
    window.plugins.WifiAdmin.getWifiInfo(
      function resolved(info) {
        defer.resolve(info);
      },
      function rejected() {
        defer.reject();
      }
    );
    return defer;
  };

  return service;
});
