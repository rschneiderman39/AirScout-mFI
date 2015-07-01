app.factory('levelTransformService', function() {
  var service = {};

  service.gaugeTransform = function(level) {
    if (typeof level === 'number') {
      return Math.max(Math.min(level + 100, 60), 1);
    }
  };

  return service;
});
