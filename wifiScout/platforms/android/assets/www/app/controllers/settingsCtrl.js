app.controller('settingsCtrl', ['$scope', '$location', 'globalSettings',
  'cordovaService', function($scope, $location, globalSettings,
  cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        $scope.hiddenAPSettings = function(option) {
          //  true = hide hidden aps
          //  false = shown hidden aps
          if( option ) {
            globalSettings.detectHidden(true);
            console.log("TRUE TRUE TRUE!!!");
          }
          else {
            globalSettings.detectHidden(false);
            console.log("FALSE FALSE FALSE!!!");
          }
        };

        $scope.filteringOptions = function(option) {
          //NEEDS TO BE IMPLEMENTED
          //  true = global filtering
          //  false = local filtering
          if( option ) {
            //globalSettings.globalFiltering(true);
          }
          else {
            //globalSettings.globalFiltering(false);
          }
        };

        $scope.defaultView = function(view) {
          // NEEDS TO BE IMPLEMENTED
          //globalSettings.defaultView(view)
          console.log("DEFAULT VIEW SELECTED IS: " + view);
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
