app.factory('globalSettings', function() {
  var service = {};

  service.detectHidden = function(newVal) {
    if (typeof newVal === 'undefined') {
      return detectHidden;
    } else if (typeof newVal === 'boolean') {
      detectHidden = newVal;
    }
  };

  var detectHidden = false,
      globalFilterSettings = true;

  return service;
});
