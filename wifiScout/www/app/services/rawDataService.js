/* Gets AP data from the device.  To get current AP data, views should use
   APService instead */
app.factory('rawDataService', function() {
  var service = {};

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
  service.getData = function() {
    var defer = $.Deferred();
    /* Tell the device to scan for APs */
    window.plugins.WifiAdmin.scan();
    /* Grab the data from the device */
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
