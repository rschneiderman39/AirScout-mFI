app.controller('settingsCtrl', ['$scope', '$location', 'cordovaService', function($scope, $location,
  cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        $scope.$on('animIn', function() {
                console.log('settingsCtrl: animIn');
            });

        $scope.$on('animOut', function() {
          console.log('settingsCtrl: animOut');
        });
      },
      function rejected() {
        console.log("settingsCtrl is unavailable because Cordova is not loaded.");
      }
    )
  }
]);
