wifiApp.factory('infoService', function() {
  var _info = undefined;
  var service = {};

  service.getInfo = function() {
    if (this._info !== undefined) {
      return this._info;
    } else {
      this.updateInfo();
      return this._info;
    }
  };

  service.updateInfo = function() {
    this._info = $.Deferred();
    // plugin api call
    getWifiInfo(
      // on success
      function(data) {
        this._info.resolve(data);
      },
      // on failure
      function() {
        this._info.reject();
      }
    );
  };

  return service;
});
