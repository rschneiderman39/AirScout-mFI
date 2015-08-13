angular.module('setup', [])
.service('setupService', ['$document', '$q', function($document, $q) {

  var setup = $q.defer();

  this.ready = setup.promise;

  angular.element($document)[0].addEventListener(events.setupDone, function() {
    setup.resolve(null);
  });

}]);