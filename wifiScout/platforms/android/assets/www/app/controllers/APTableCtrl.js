app.controller('APTableCtrl', ['$scope', '$timeout', 'APService',
  'filterSettingsService', 'tableSortSettingsService', 'cordovaService',
  function($scope, $timeout, APService, filterSettingsService,
    tableSortSettingsService, cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        // Settings for this session
        $scope.selectedAPData = [];         // The AP objects representing the APs we want to display
        $scope.sortPredicate = 'SSID';    // Sorting options
        $scope.sortReverse = false;       // ..
        // Change the sort predicate, or reverse the sort direction
        $scope.order = function(predicate) {
          $scope.sortReverse = ($scope.sortPredicate === predicate) ? !$scope.sortReverse : false;
          $scope.sortPredicate = predicate;
        }

        // true: show all APs, including new ones as they are discovered
        // false: only show selected APs
        var showAll = true,
            // Because AP data is constantly changing, we use MAC addresses
            // as a permanent ID for the APs we've selected
            selectedBSSIDs = [],
            update = true,
            UPDATE_INTERVAL = 500;

        // Update the table whenever filter settings are changed
        var updateSelection = function(settings) {
          selectedBSSIDs = settings.selectedBSSIDs;
          showAll = settings.showAll;
          forceUpdate();
          filterSettingsService.requestSettings('APTable').done(updateSelection);
        };

        // Save our sort settings to the settings service
        var pushSortSettings = function() {
          tableSortSettingsService.setSortPredicate($scope.sortPredicate);
          tableSortSettingsService.setSortReverse($scope.sortReverse);
        };

        // Update the table now
        var forceUpdate = function() {
          $scope.$apply(function() {
            if (showAll) {
              $scope.selectedAPData = APService.getNamedAPData();
            } else {
              // Show only the APs whose BSSIDs match those we've selected
              $scope.selectedAPData = APService.getSelectedAPData(selectedBSSIDs);
            }
          });
        };

        // Update the table every quantum
        var update = function() {
          if (update) {
            forceUpdate();
            setTimeout(update, UPDATE_INTERVAL);
          }
        };

        var init = function() {
          $scope.$on('$destroy', function() {
            update = false;
            pushSortSettings();
          });

          var settings = filterSettingsService.getSettings('APTable');
          selectedBSSIDs = settings.selectedBSSIDs;
          showAll = settings.showAll;
          $scope.sortPredicate = tableSortSettingsService.getSortPredicate();
          $scope.sortReverse = tableSortSettingsService.getSortReverse();
          filterSettingsService.requestSettings('APTable').done(updateSelection);

          setTimeout(update, UPDATE_INTERVAL);
        };

        /* INIT */

        init();
      },
      function rejected() {
        console.log("APTableCtrl is unavailable because Cordova is not loaded.");
      }
    );
  }]);