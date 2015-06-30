app.controller('tableCtrlNew', ['$scope', '$timeout', 'APService', 'filterService',
                             'settingsService', 'cordovaService',
  function($scope, $timeout, APService, filterService, settingsService, cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        $scope.table = {
          selectedAPs: [],
          sortPredicate: 'SSID',
          sortReverse: false,
          order: function(predicate) {
            this.sortReverse = (this.sortPredicate === predicate) ? !this.sortReverse : false;
            this.sortPredicate = predicate;
          }
        };

        var _showAll = true;
        var _selectedBSSIDs = [];

        var _onSettingsChange = function(settings) {
          _selectedBSSIDs = settings.selectedBSSIDs.slice();
          _showAll = settings.showAll;
          _forceUpdate();
          settingsService.table.getSettings().done(_onSettingsChange);
        };

        var _pushSortSettings = function() {
          settingsService.table.setSortPredicate($scope.table.sortPredicate);
          settingsService.table.setSortReverse($scope.table.sortReverse);
        };

        // Updates the table right now
        var _forceUpdate = function() {
          if (_showAll) {
            $scope.table.selectedAPs = APService.getNamedAPs();
          } else {
            $scope.table.selectedAPs = filterService.filter(
              APService.getNamedAPs(),
              _selectedBSSIDs
            );
          }
        };

        // Updates the table every quantum
        var _update = function() {
          _forceUpdate();
          $timeout(_update, 500);
        }

        // Pull settings from settingsService, and start settings update loop
        settingsService.table.getSettingsImmediate().done(
          function(settings) {
            $scope.table.sortPredicate = settings.sortPredicate;
            $scope.table.sortReverse = settings.sortReverse;
            _selectedBSSIDs = settings.selectedBSSIDs.slice();
            _showAll = settings.showAll;
            settingsService.table.getSettings().done(_onSettingsChange);
          }
        );

        // Start table update loop
        _update();


        $scope.$on('$destroy', _pushSortSettings);

      },
      function rejected() {
        console.log("tableCtrl is unavailable because Cordova is not loaded.")
      }
    );
  }]);
