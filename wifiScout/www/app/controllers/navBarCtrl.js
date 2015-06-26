app.controller('navBarCtrl', ['$scope', '$timeout', '$location' 'cordovaService',
  function($scope, $timeout, $location, cordovaService) {
  	cordovaService.ready.then(
  		var pageLeft = function(view) {
        $location.path(view);
      }

      var pageRight = function() {
          
      }
  	); 
  }]);