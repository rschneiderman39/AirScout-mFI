app.factory('APService', ['rawDataService', function(rawDataService) {
  var service = {};

  service.getAllAPs = function() { return _allAPs; };
  service.getNamedAPs = function() { return _namedAPs; };

  var _allAPs = [];
  var _namedAPs = [];

  var _update = function() {
    rawDataService.getInfo()
    .done(function(info) {
      _allAPs = info.available;
      _namedAPs = info.available.filter(
        function(ap) { return ap.SSID !== ""; }
      );
    })
    .fail(function() {
      _allAPs = [];
      _namedAPs = [];
    });
    setTimeout(_update, 500);
  };

  _update();

  return service;
}]);
