// Gets AP info from the device.
app.factory('infoService', function() {
  var service = {};

  service.getInfo = function() {
    var defer = $.Deferred();
    // plugin api calls
    window.plugins.WifiAdmin.scan();
    window.plugins.WifiAdmin.getWifiInfo(
      // on success
      function(info) {
        defer.resolve(info);
      },
      // on failure
      function() {
        defer.reject();
      }
    );
    return defer;
  };

  return service;
});
