/* Gets AP data from the device.  To get current AP data, views should use
   accessPoints instead */
app.factory('networkData', ['setupService', function(setupService) {

  var service = {};

  setupService.ready.then(function() {
    /* Get the device's AP data.
       @returns {Object} An object of the form:
         {
           activity: {
             BSSID:  <String>,
             HiddenSSID:  <Boolean>
             SSID:  <String>,
             MacAddress:  <String>,
             IpAddress:  <String>,
             NetworkId:  <String>,
             RSSI:  <Number>,
             LinkSpeed:  <Number>
           },
           available: [
             {
               BSSID: <String>,
               SSID: <String>,
               frequency: <Number>
               level: <Number>
               capabilities: <String>
             },
             ...
           ]
        }
        The "available" field represents all the APs the device can see.
    */
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
