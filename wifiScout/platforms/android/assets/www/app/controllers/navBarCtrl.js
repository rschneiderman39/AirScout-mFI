app.controller('navBarCtrl', ['$scope', '$timeout', '$location', 'cordovaService',
  function($scope, $timeout, $location, cordovaService) {
  	cordovaService.ready.then(
  		function resolved() {
  		console.log("IN table controller");
  		$scope.pageLeft = function(view) {
  			console.log("HEY SWIPING LEFT");
        $location.path(view);
      }

      var pageRight = function() {
          
      }
    },
    function rejected() {
        console.log("navBarCtrl is unavailable because Cordova is not loaded.")
      }
  	); 

  }]);