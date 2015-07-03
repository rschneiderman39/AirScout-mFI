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
        var _showAll = true;

        // Because AP data is constantly changing, we use MAC addresses
        // as a permanent ID for the APs we've selected
        var _selectedBSSIDs = [];

        // Update the table whenever settings are changed
        var _onSettingsChange = function(settings) {
          _selectedBSSIDs = settings.selectedBSSIDs.slice();
          _showAll = settings.showAll;
          _forceUpdate();
          filterSettingsService.getSettings('table').done(_onSettingsChange);
        };

        // Save our sort settings to the settings service
        var _pushSortSettings = function() {
          filterSettingsService.setSortPredicate('table', $scope.sortPredicate);
          filterSettingsService.setSortReverse('table', $scope.sortReverse);
        };

        // Update the table now
        var _forceUpdate = function() {
          if (_showAll) {
            $scope.selectedAPData = APService.getNamedAPData();
          } else {
            // Show only the APs whose BSSIDs match those we've selected
            $scope.selectedAPData = APSelectorService.filter(
              APService.getNamedAPData(),
              _selectedBSSIDs
            );
          }
        };

        // Update the table every quantum
        var _update = function() {
          _forceUpdate();
          $timeout(_update, 500);
        };

        // Pull settings from filterSettingsService, and start waiting on settings changes
        filterSettingsService.getSettingsImmediate('table').done(
          function(settings) {
            $scope.sortPredicate = settings.sortPredicate;
            $scope.sortReverse = settings.sortReverse;
            _selectedBSSIDs = settings.selectedBSSIDs.slice();
            _showAll = settings.showAll;
            filterSettingsService.getSettings('table').done(_onSettingsChange);
          }
        );

        _update();

        // When we navigate away, remember our sort settings
        $scope.$on('$destroy', _pushSortSettings);

      },
      function rejected() {
        console.log("tableCtrl is unavailable because Cordova is not loaded.");
      }
    );
  }]);
