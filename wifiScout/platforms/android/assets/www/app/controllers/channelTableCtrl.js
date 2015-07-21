app.controller('channelTableCtrl', ['$scope', '$location', 'cordovaService', function($scope, $location,
  cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        console.log("IN CHANNELTABLE CTRL!");
        $scope.$on('animIn', function() {
                console.log('CHANNELTABLECTRL: animIn');
            });

        $scope.$on('animOut', function() {
          console.log('CHANNELTABLECTRL: animOut');
        });
      },
      function rejected() {
        console.log("channelTableCtrl is unavailable because Cordova is not loaded.");
      }
    )
  }
]);
