app.controller('navBarCtrl', ['$scope', '$location', 'cordovaService',
  function($scope, $location, cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        console.log("IN NAVBAR CONTROLLER");

        $scope.pageLeft = function(view) {
         console.log("HEY SWIPING LEFT");
          $location.path(view);
        }
      },
      function rejected() {
        console.log("navBarCtrl is unavailable because Cordova is not loaded.");
      }
    );
}]);
