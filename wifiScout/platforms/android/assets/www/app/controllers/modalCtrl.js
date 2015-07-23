app.controller('modalCtrl', ['$scope', 'APService', 'filterSettingsService',
                             'cordovaService',
  function($scope, APService, filterSettingsService, cordovaService) {
    cordovaService.ready.then(
      function resolved(){
        console.log("IN MODAL CTRL!");
        // Settings for this session
        $scope.modal = {
          allAPData: [],             // Every AP we know about
          selectedAPData: []         // The set of selected APs
        };

        var view = undefined;

        $scope.select = function(ap) {
          console.log("CLICKED ON A LIST ITEM!");
          var arrPosition = $scope.modal.selectedAPData.indexOf(ap);
          if( arrPosition === -1 ) {
            $scope.modal.selectedAPData.push(ap);
          }
          else {
            $scope.modal.selectedAPData.splice(arrPosition, 1);
          }
        };

        $scope.isActive = function(ap) {
          var arrPosition = $scope.modal.selectedAPData.indexOf(ap);
          return arrPosition === -1;
        }

        // Select all APs, and show any new AP that later becomes visible
        var showAll = function() {

          filterSettingsService.setShowAll(view, true);
          //filterSettingsService.setSelectedBSSIDs(view, []);
          $scope.$apply(function() {
            $scope.modal.selectedAPData = $scope.modal.allAPData.slice();
          });
        }

        // Unselect all APs
        /*
        var hideAll = function() {
          filterSettingsService.setShowAll(view, false);
          filterSettingsService.setSelectedBSSIDs(view, []);
          $scope.$apply(function() { $scope.modal.selectedAPData = []; });
        } 
        */

        // Initialize the modal with the settings used previously
        var init = function() {
          //var settings = filterSettingsService.getSettings(view);
          $scope.$apply(function() {
            $scope.modal.allAPData = APService.getNamedAPData();
            /*
            if (settings.showAll) {
              $scope.modal.selectedAPData = APService.getNamedAPData();
            } else {
              $scope.modal.selectedAPData = APService.getSelectedAPData(settings.selectedBSSIDs);
            }
            */
          });
        };

        // Update the settings service with our new selection
        /*
        var pushSelection = function() {
          filterSettingsService.setShowAll(view, false);
          filterSettingsService.setSelectedBSSIDs(view, $scope.modal.selectedAPData.map(
            function(ap) { return ap.BSSID; }
          ));
        };
        */

        // Set up button and checkbox event handlers
        $('#filterModal').on('show.bs.modal', init);
        //$('#modalList').on('click', pushSelection);
        //$('#btnShow').on('click', showAll);
        //$('#btnHide').on('click', hideAll); 

        //Determine the view from the hidden viewTitle DOM element.
        var setView = function() {
          view = $('#viewTitle').attr('ng-class');
        }

        // This is needed because of the late binding of the ng-class attribute
        setTimeout(setView, 0);
      },
      function rejected() {
        console.log("modalCtrl is unavailable because Cordova is not loaded.")
      }
    );
  }]);
