app.controller('modalCtrl', ['$scope', 'APService', 'filterSettingsService',
                             'APSelectorService', 'cordovaService',
  function($scope, APService, filterSettingsService, APSelectorService, cordovaService) {
    cordovaService.ready.then(
      function resolved(){
        // Settings for this session
        $scope.modal = {
          allAPData: [],             // Every AP we know about
          selectedAPData: [],        // The set of selected APs
          buttonText: 'List by MAC',
        };

        var _view = undefined;

        // Select all APs, and show any new AP that later becomes visible
        var _showAll = function() {
          filterSettingsService.setShowAll(_view, true);
          filterSettingsService.setSelectedBSSIDs(_view, []);
          $scope.$apply(function() {
            $scope.modal.selectedAPData = $scope.modal.allAPData.slice();
          });
        }

        // Unselect all APs
        var _hideAll = function() {
          filterSettingsService.setShowAll(_view, false);
          filterSettingsService.setSelectedBSSIDs(_view, []);
          $scope.$apply(function() { $scope.modal.selectedAPData = []; });
        }

        // Initialize the modal with the settings used previously
        var _init = function() {
          var settings = filterSettingsService.getInitSettings(_view);
          $scope.$apply(function() {
            $scope.modal.allAPData = APService.getNamedAPData();
            if (settings.showAll) {
              $scope.modal.selectedAPData = $scope.modal.allAPData.slice();
            } else {
              $scope.modal.selectedAPData = APSelectorService.filter(
                $scope.modal.allAPData,
                settings.selectedBSSIDs
              );
            }
          });
        };

        // Update the settings service with our new selection
        var _pushSelection = function() {
          filterSettingsService.setShowAll(_view, false);
          filterSettingsService.setSelectedBSSIDs(_view, $scope.modal.selectedAPData.map(
            function(ap) { return ap.BSSID; }
          ));
        };

        // Set up button and checkbox event handlers
        $('#filterModal').on('show.bs.modal', _init);
        $('#modalList').on('click', _pushSelection);
        $('#btnShow').on('click', _showAll);
        $('#btnHide').on('click', _hideAll);

        /* Determine the view from the hidden viewTitle DOM element. */
        var _setView = function() {
          _view = $('#viewTitle').attr('ng-class');
        }

        // This is needed because of the late binding of the ng-class attribute
        setTimeout(_setView, 0);
      },
      function rejected() {
        console.log("modalCtrl is unavailable because Cordova is not loaded.")
      }
    );
  }]);
