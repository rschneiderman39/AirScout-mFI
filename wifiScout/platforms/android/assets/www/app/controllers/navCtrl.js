app.controller('navCtrl', ['$scope', 'cordovaService',
  function($scope, cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        $scope.selected = 'Settings';
      },
      function rejected() {
        console.log("navCtrl is unavailable because Cordova is not loaded.");
      }
    );
}]);
