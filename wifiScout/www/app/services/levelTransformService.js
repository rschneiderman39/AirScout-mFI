app.factory('levelTransformService', function() {
  var service = {};

  // Returns a value between 0 and 600, where 0 corresponds to a level
  // of -100 dBm, and 600 corresponds to a level of -40 dBm
  service.gaugeTransform = function(level) {
    if (typeof level === 'number') {
      return Math.max(Math.min(level + 100, 60), 0) * 10;
    }
  };

  return service;
});
