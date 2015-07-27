app.factory('globalSettings', function() {
  var service = {};

  service.detectHidden = function(newVal) {
    if (typeof newVal === 'undefined') {
      return detectHidden;
    } else if (typeof newVal === 'boolean') {
      detectHidden = newVal;
    }
  };

  service.globalFilter = function(newVal) {
    if (typeof newVal === 'undefined') {
      return globalFilter;
    } else if (typeof newVal === 'boolean') {
      globalFilter = newVal;
    }
  };

  service.defaultView = function(newVal) {
    if (typeof newVal === 'undefined') {
      return defaultView;
    } else if (typeof newVal === 'string') {
      defaultView = newVal;
    }
  };

  var detectHidden = false,
      globalFilter = false,
      defaultView = 'settings';

  return service;
});
