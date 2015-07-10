/* Contains some utility functions for performing transformations on
   signal strength values.  For now, only needed for the gauge.
*/
app.factory('levelTransformService', function() {
  var service = {};

  /* Convert a signal strength value into one renderable on the gauge.
     @returns {Number} A value between 0 and 600, where 0 corresponds to a level
     of -100 dBm, and 700 corresponds to a level of -30 dBm
  */
  service.gaugeTransform = function(level) {
    if (typeof level === 'number') {
      return Math.max(Math.min(level + 100, 70), 0) * 10;
    }
  };

  return service;
});
