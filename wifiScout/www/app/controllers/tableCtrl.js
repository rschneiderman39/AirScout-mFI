app.controller('tableCtrl', ['$scope', '$timeout', 'APService', 'APSelectorService',
                             'filterSettingsService', 'cordovaService',
  function($scope, $timeout, APService, APSelectorService, filterSettingsService, cordovaService) {
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

        // Update the table whenever settings are changed
        var onSettingsChange = function(settings) {
          selectedBSSIDs = settings.selectedBSSIDs.slice();
          showAll = settings.showAll;
          forceUpdate();
          filterSettingsService.requestSettings('table').done(onSettingsChange);
        };

        // Save our sort settings to the settings service
        var pushSortSettings = function() {
          filterSettingsService.setSortPredicate('table', $scope.sortPredicate);
          filterSettingsService.setSortReverse('table', $scope.sortReverse);
        };

        // Update the table now
        var forceUpdate = function() {
          if (showAll) {
            $scope.selectedAPData = APService.getNamedAPData();
          } else {
            // Show only the APs whose BSSIDs match those we've selected
            $scope.selectedAPData = APSelectorService.filter(
              APService.getNamedAPData(),
              selectedBSSIDs
            );
          }
        };

        // Update the table every quantum
        var update = function() {
          if (update) {
            forceUpdate();
            $timeout(update, UPDATE_INTERVAL);
          }
        };

        /* INIT */

        // When we navigate away, remember our sort settings
        $scope.$on('$destroy', function() {
          update = false;
          pushSortSettings();
        });

        // Pull settings from filterSettingsService, and start waiting on settings changes
        var settings = filterSettingsService.getSettings('table');
        $scope.sortPredicate = settings.sortPredicate;
        $scope.sortReverse = settings.sortReverse;
        selectedBSSIDs = settings.selectedBSSIDs.slice();
        showAll = settings.showAll;
        filterSettingsService.requestSettings('table').done(onSettingsChange);

        // Start update loop
        update();
      },
      function rejected() {
        console.log("tableCtrl is unavailable because Cordova is not loaded.");
      }
    );
  }]);
