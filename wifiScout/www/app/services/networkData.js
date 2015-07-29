/* Gets AP data from the device.  To get current AP data, views should use
   accessPoints instead */
app.factory('networkData', ['cordovaService', function(cordovaService) {
  var service = {};
  cordovaService.ready.then(function() {
    service.get = function() {
      var defer = $.Deferred();
      window.plugins.WifiAdmin.scan();
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

  });

  return service;

}]);