app.controller('tableCtrl', ['$scope', '$timeout', 'APService', 'filterService',
                             'filterSettingsService', 'cordovaService',
  function($scope, $timeout, APService, filterService, filterSettingsService, cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        // Settings for this session
        $scope.table = {
          selectedAPs: [],         // The AP objects representing the APs we want to display
          sortPredicate: 'SSID',   // Sorting options
          sortReverse: false,      // ..
          // Change the sort predicate, or reverse the sort direction
          order: function(predicate) {
            this.sortReverse = (this.sortPredicate === predicate) ? !this.sortReverse : false;
            this.sortPredicate = predicate;
          }
        };

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
          filterSettingsService.setSortPredicate('table', $scope.table.sortPredicate);
          filterSettingsService.setSortReverse('table', $scope.table.sortReverse);
        };

        // Update the table now
        var _forceUpdate = function() {
          if (_showAll) {
            $scope.table.selectedAPs = APService.getNamedAPs();
          } else {
            // Show only the APs whose BSSIDs match those we've selected
            $scope.table.selectedAPs = filterService.filter(
              APService.getNamedAPs(),
              _selectedBSSIDs
            );
          }
        };

        // Update the table every quantum
        var _update = function() {
          _forceUpdate();
          $timeout(_update, 500);
        }

        // Pull settings from filterSettingsService, and start waiting on settings changes
        filterSettingsService.getSettingsImmediate('table').done(
          function(settings) {
            $scope.table.sortPredicate = settings.sortPredicate;
            $scope.table.sortReverse = settings.sortReverse;
            _selectedBSSIDs = settings.selectedBSSIDs.slice();
            _showAll = settings.showAll;
            filterSettingsService.getSettings('table').done(_onSettingsChange);
          }
        );

        // Start table update loop
        _update();

        // When we navigate away, remember our sort settings
        $scope.$on('$destroy', _pushSortSettings);

      },
      function rejected() {
        console.log("tableCtrl is unavailable because Cordova is not loaded.");
      }
    );
  }]);
