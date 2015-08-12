app.factory('timeGraphManager', ['accessPoints', 'setupService',
  function(acessPoints, setupService) {

  var service = {};

  setupService.ready.then(function() {

    service.getDatasets = function() {
      var times = [];
      for (var i = -60; i <= 1; ++i) {
        times.push(i);
      }
    }
  });

});
