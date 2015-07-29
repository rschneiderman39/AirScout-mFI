app.factory('APTableState', ['cordovaService', function(cordovaService) {
  var service = {};
  cordovaService.ready.then(function() {
      var settings = {
          sortPredicate: 'SSID',
          sortReverse: false
        };

      service.sortPredicate = function(predicate) {
        if (predicate === undefined) {
          return settings.sortPredicate;
        } else if (typeof predicate === 'string') {
          settings.sortPredicate = predicate;
        }
      };

      service.sortReverse = function(reverse) {
        if (reverse === undefined) {
          return settings.sortReverse;
        } else if (typeof reverse === 'boolean') {
          settings.sortReverse = reverse;
        }
      };

  });

  return service;

}]);