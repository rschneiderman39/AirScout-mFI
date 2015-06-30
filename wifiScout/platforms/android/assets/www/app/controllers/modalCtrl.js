app.controller('modalCtrl', ['$scope', 'APService', 'settingsService',
                             'filterService', 'cordovaService',
  function($scope, APService, settingsService, filterService, cordovaService) {
    cordovaService.ready.then(
      function resolved(){
        $scope.modal = {
          allAPs: [],
          selectedAPs: [],
          selector: 'SSID',
          buttonText: 'List by MAC',
        };

        alert(document.getElementById('viewTitle').innerHTML);
        var _view = 'table';

        var _toggleSelector = function() {
          if ($scope.modal.selector === 'SSID') {
            $scope.modal.buttonText = 'List by SSID';
            $scope.modal.selector = 'BSSID';
          } else {
            $scope.modal.buttonText = 'List by MAC';
            $scope.modal.selector = 'SSID';
          }
        };

        var _showAll = function() {
          settingsService[_view].setShowAll(true);
          settingsService[_view].setSelectedBSSIDs([]);
          $scope.modal.selectedAPs = $scope.modal.allAPs.slice();
        }

        var _hideAll = function() {
          settingsService[_view].setShowAll(false);
          settingsService[_view].setSelectedBSSIDs([]);
          $scope.modal.selectedAPs = [];
        }

        var _init = function() {
          settingsService[_view].getSettingsImmediate().done(
            function(settings) {
              $scope.modal.allAPs = APService.getNamedAPs();
              if (settings.showAll) {
                $scope.modal.selectedAPs = $scope.modal.allAPs.slice();
              } else {
                $scope.modal.selectedAPs = filterService.filter(
                  $scope.modal.allAPs,
                  settings.selectedBSSIDs
                );
              }
            }
          )
        };

        var _pushSelection = function() {
          settingsService[_view].setSelectedBSSIDs($scope.modal.selectedAPs.map(
            function(ap) {return ap.BSSID; }
          ));
        };

        $('#modal').on('show.bs.modal', _init);
        $('#modalList').on('click', _pushSelection);
        $('#btnShow').on('click', _showAll);
        $('#btnHide').on('click', _hideAll);

      },
      function rejected() {
        console.log("modalCtrl is unavailable because Cordova is not loaded.")
      }
    );
  }]);
