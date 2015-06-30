app.controller('tableCtrl', ['$scope', '$timeout', '$location', 'APService',
                             'filterService', 'cordovaService', '$element',
  function($scope, $timeout, $location, APService, filterService, cordovaService, $element) {
    cordovaService.ready.then(
      function resolved() {
        $scope.modal = {
          allAPs: [],
          selectedAPs: [],
          selector: 'SSID',
          buttonText: 'List by MAC',
          toggleSelector: function() {
            if (this.selector === 'SSID') {
              this.buttonText = 'List by SSID';
              this.selector = 'BSSID';
            } else {
              this.buttonText = 'List by MAC';
              this.selector = 'SSID';
            }
          },
          showAll: function() {
            this.selectedAPs = this.allAPs.slice();
            _showAll = true;
            _forceUpdate();
          },
          hideAll: function() {
            this.selectedAPs = [];
            _showAll = false;
            _modalToTable();
          }
        };

        $scope.table = {
          selectedAPs: [],
          predicate: 'SSID',
          reverse: false,
          order: function(predicate) {
            this.reverse = (this.predicate === predicate) ? !this.reverse : false;
            this.predicate = predicate;
          }
        };

        $scope.isSelected = function(MAC) {
          return $scope.selected == MAC;
        };

        $scope.setSelected = function(level, MAC) {
          console.log("**** AP HAS BEEN CLICKED *****");
          console.log("Signal strength for this AP is: " + level);
          $scope.selected = MAC;
        };

        var _showAll = true;
        var _selectedBSSIDs = [];

        // Updates the table every quantum
        var _update = function() {
          _forceUpdate();
          $timeout(_update, 1000);
        };

        // Updates the table immediately
        var _forceUpdate = function() {
          if (_showAll) {
            $scope.table.selectedAPs = APService.namedAPs;
          } else {
            $scope.table.selectedAPs = filterService.filter(
              APService.namedAPs,
              _selectedBSSIDs
            );
          }
        }

        // Updates the state of the modal each time it's opened
        var _initModal = function() {
          $scope.modal.allAPs = APService.namedAPs;
          if (_showAll) {
            $scope.modal.selectedAPs = $scope.modal.allAPs.slice();
          } else {
            $scope.modal.selectedAPs = filterService.filter(
              $scope.modal.allAPs,
              _selectedBSSIDs
            );
          }
        }

        // Updates the table with the user's new selection
        var _modalToTable = function() {
          _selectedBSSIDs = $scope.modal.selectedAPs.map(
            function(ap) {return ap.BSSID; }
          );
          _forceUpdate();
        }

        // When a checkbox is clicked, turn off showAll mode, and
        // update the table as soon as angular has dealt with the two way
        // data rebinding.
        var _onCheckboxClick = function() {
          _showAll = false;
          $timeout(_modalToTable, 100);
        }

        // Init
        $('#tableModal').on('show.bs.modal', _initModal);
        $('#tableModal').on('hide.bs.modal', _modalToTable);
        $('#tableModalList').on('click', _onCheckboxClick);

        _update();
      },
      function rejected() {
        console.log("tableCtrl is unavailable because Cordova is not loaded.")
      }
    );
}]);
