app.controller('settingsCtrl', ['$scope', '$location', 'globalSettings',
  'cordovaService', function($scope, $location, globalSettings,
  cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        $scope.detectHidden = function() {
          globalSettings.detectHidden(true);
        };

        $scope.ignoreHidden = function() {
          globalSettings.detectHidden(false);
        };

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
