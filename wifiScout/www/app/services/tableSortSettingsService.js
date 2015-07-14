app.factory('tableSortSettingsService', function() {
  var service = {},
      settings = {
        sortPredicate: 'SSID',
        sortReverse: false
      };

    service.getSortPredicate = function() {
      return settings.sortPredicate;
    };
    service.getSortReverse = function() {
      return settings.sortReverse;
    }
    service.setSortPredicate = function(predicate) {
      if (typeof predicate === 'string') {
        settings.sortPredicate = predicate;
      }
    };
    service.setSortReverse = function(reverse) {
      if (typeof reverse === 'boolean') {
        settings.sortReverse = reverse;
      }
    };

    return service;
});
