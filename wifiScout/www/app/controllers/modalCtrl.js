app.controller('modalCtrl', ['$scope', 'accessPoints',
  'globalSettings', 'utils', 'cordovaService', function($scope, accessPoints,
    globalSettings, utils, cordovaService) {
    cordovaService.ready.then(
      function resolved(){
        $scope.APData = [];

        $scope.toggleSelected = function(AP) {
          isSelected[AP.BSSID] = isSelected[AP.BSSID] ? false : true;
          sendSelection();
        };

        $scope.isSelected = function(AP) {
          return isSelected[AP.BSSID];
        };

        // Select all APs, and show any new AP that later becomes visible
        $scope.selectAll = function() {
          for (var i = 0; i < $scope.APData.length; ++i) {
            isSelected[$scope.APData[i].BSSID] = true;
          }
          globalSettings.setSelection(view, {
            showAll: true,
            selectedBSSIDs: []
          });
        };

        $scope.unselectAll = function() {
          globalSettings.setSelection(view, {
            showAll: false,
            selectedBSSIDs: []
          });
          isSelected = {};
        };

        $scope.sortSSID = utils.hiddenSSIDSort;

        var view = undefined,
            isSelected = {};

        var onShow = function() {
          var settings = globalSettings.getSelection(view);
          $scope.$apply(function() {
            $scope.APData = accessPoints.getAll();
            if (settings.showAll) {
              for (var i = 0; i < $scope.APData.length; ++i) {
                isSelected[$scope.APData[i].BSSID] = true;
              }
            } else {
              for (var i = 0; i < settings.selectedBSSIDs.length; ++i) {
                isSelected[settings.selectedBSSIDs[i]] = true;
              }
            }
          });
        };

        var sendSelection = function() {
          var selection = [];
          for (var BSSID in isSelected) {
            if (isSelected[BSSID]) selection.push(BSSID);
          }
          globalSettings.setSelection(view, {
            showAll: false,
            selectedBSSIDs: selection
          });
        };

        var prepView = function() {
          $('.filterTable').css('height', document.deviceHeight * 0.6);
          $('#filterModal').on('show.bs.modal', onShow);
        };

        //Determine the view from the hidden viewTitle DOM element.
        var detectView = function() {
          view = $('#viewTitle').attr('ng-class');
        };

        var init = function() {
          prepView();
          setTimeout(detectView, 0);
        };

        init();
      },
      function rejected() {
        console.log("modalCtrl is unavailable because Cordova is not loaded.")
      }
    );
  }]);
