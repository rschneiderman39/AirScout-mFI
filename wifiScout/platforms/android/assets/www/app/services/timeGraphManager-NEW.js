app.factory('timeGraphManager', ['accessPoints', 'setupService',
  function(acessPoints, setupService) {

  var service = {};

  setupService.ready.then(function() {

    var datasets = {};

    service.getDatasets = function() {
      accessPoints.getAll().done(function(results) {
        var macAddrToAccessPoint = {};

        for (var i = 0; i < results.length; ++i) {
          macAddrToAccessPoint[results[i].MAC] = results[i];
        }
      });
    };

  });

  return service;

}]);
