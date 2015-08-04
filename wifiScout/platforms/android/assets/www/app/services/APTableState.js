/* Globally preserves sort settings for AP Table view. */
app.factory('APTableState', ['setupService', function(setupService) {

  var service = {};

  setupService.ready.then(function() {

      var sortPredicate = 'SSID',
          sortReverse = false;

      /* Get or set the table sort predicate.
       *
       * @param {string|function} [predicate]: If specified, the new predicate value.
       * @returns {string|function} The current predicate, but only if no arg specified.
       */
      service.sortPredicate = function(predicate) {
        if (predicate === undefined) {
          return sortPredicate;
        } else if (typeof predicate === 'string') {
          sortPredicate = predicate;
        }
      };

      /* Get or set the table sort reverse flag.
       *
       * @param {string|function} [reverse]: If specified, the new reverse flag.
       * @returns {string|function} The current flag, but only if no arg specified.
       */
      service.sortReverse = function(reverse) {
        if (reverse === undefined) {
          return sortReverse;
        } else if (typeof reverse === 'boolean') {
          sortReverse = reverse;
        }
      };

  });

  return service;

}]);
