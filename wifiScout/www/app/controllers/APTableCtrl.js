app.controller('APTableCtrl', ['$scope', 'accessPoints', 'utils',
  'filterSettings', 'tableSettings', 'cordovaService',
  function($scope, accessPoints, utils, filterSettings,
    tableSettings, cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        // Settings for this session
        $scope.selectedAPData = [];         // The AP objects representing the APs we want to display
        $scope.sortPredicate = undefined;    // Sorting options
        $scope.sortReverse = undefined;       // ..
        // Change the sort predicate, or reverse the sort direction
        $scope.order = function(predicate) {
          if (predicate === 'SSID') {
            $scope.sortReverse = ($scope.sortPredicate === $scope.sortSSID) ? !$scope.sortReverse : false;
            $scope.sortPredicate = $scope.sortSSID;
          } else {
            $scope.sortReverse = ($scope.sortPredicate === predicate) ? !$scope.sortReverse : false;
            $scope.sortPredicate = predicate;
          }
        };

        $scope.sortSSID = utils.hiddenSSIDSort;

        // true: show all APs, including new ones as they are discovered
        // false: only show selected APs
        var showAll = true,
            // Because AP data is constantly changing, we use MAC addresses
            // as a permanent ID for the APs we've selected
            selectedBSSIDs = [],
            UPDATE_INTERVAL = 500;

        // Update the table whenever filter settings are changed
        var updateSelection = function(settings) {
          selectedBSSIDs = settings.selectedBSSIDs;
          showAll = settings.showAll;
          update();
          filterSettings.await('global').done(updateSelection);
        };

        // Save our sort settings to the settings service
        var storeSortSettings = function() {
          tableSettings.sortPredicate($scope.sortPredicate);
          tableSettings.sortReverse($scope.sortReverse);
        };

        // Update the table now
        var update = function() {
          $scope.$apply(function() {
            if (showAll) {
              $scope.selectedAPData = accessPoints.getAll();
            } else {
              // Show only the APs whose BSSIDs match those we've selected
              $scope.selectedAPData = accessPoints.getSelected(selectedBSSIDs);
            }
          });
        };

        var init = function() {
          var settings = filterSettings.get('global');
          selectedBSSIDs = settings.selectedBSSIDs;
          showAll = settings.showAll;

          var predicate = tableSettings.sortPredicate();
          if (predicate === 'SSID') {
            $scope.sortPredicate = $scope.sortSSID;
          } else {
            $scope.sortPredicate = predicate;
          }
          $scope.sortReverse = tableSettings.sortReverse();

          filterSettings.await('global').done(updateSelection);

          var updateLoop = setInterval(update, UPDATE_INTERVAL);

          $scope.$on('$destroy', function() {
            clearInterval(updateLoop);
            storeSortSettings();
          });
        };

        /* INIT */

        init();
      },
      function rejected() {
        console.log("APTableCtrl is unavailable because Cordova is not loaded.");
      }
    );
  }]);
