app.factory('channelTableState', ['setupService', function(setupService) {

  var service = {};

  setupService.ready.then(function() {

    var band = undefined,
        viewportExtent = undefined;

    service.band = function(newBand) {
      if (newBand === undefined) {
        return band;
      } else if (newBand === '2_4' || newBand === '5') {
        band = newBand;
      }
    };

    service.viewportExtent = function(newExtent) {
      if (newExtent === undefined) {
        return viewportExtent
      } else if (newExtent instanceof Array && newExtent.length === 2) {
        viewportExtent = newExtent;
      }
    };
  });

  return service;
}]);
