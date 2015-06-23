app.factory('infoService', function() {
  var _info = $.Deferred().reject();
  var service = {};

  service.getInfo = function() {
      return _info;
  };

  service.updateInfo = function() {
    _info = $.Deferred();
    // plugin api call
    window.plugins.WifiAdmin.getWifiInfo(
      // on success
      function(data) {
        _info.resolve(data);
      },
      // on failure
      function() {
        _info.reject();
      }
    );
  };

  return service;
});
