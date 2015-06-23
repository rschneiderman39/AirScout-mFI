/*
* infoService provides an interface for getting AP information
* from the device.
*
* getInfo - Returns a deferred object which will resolve to the data fetched
            and stored by updateInfo.  updateInfo should always be called first.
* updateInfo - Fetch and store AP info from the device.
*
*/
app.factory('infoService', function() {
  var _info = $.Deferred().reject();
  var service = {};

  service.getInfo = function() {
    return _info;
  }

  service.updateInfo = function() {
    _info = $.Deferred();
    // plugin api call
    window.plugins.WifiAdmin.getWifiInfo(
      // on success
      function(info) {
        _info.resolve(info);
      },
      // on failure
      function() {
        _info.reject();
      }
    );
  };

  return service;
});
