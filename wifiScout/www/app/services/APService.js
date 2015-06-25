app.factory('APService', ['rawDataService', function(rawDataService) {
  var service = {};
  service.allAPs = [];
  service.namedAPs = [];

  var _update = function() {
    rawDataService.getInfo()
    .done(function(info) {
      service.allAPs = info.available;
      service.namedAPs = info.available.filter(
        function(ap) { return ap.SSID !== ""; }
      );
    })
    .fail(function() {
      service.allAPs = [];
      service.namedAPs = [];
    });
    setTimeout(_update, 1000);
  };

  _update();

  return service;
}]);
