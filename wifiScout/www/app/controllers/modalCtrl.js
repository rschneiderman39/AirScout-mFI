app.controller('modalCtrl', ['$scope', 'accessPoints', 'globalSettings',
'setupService', function($scope, accessPoints, globalSettings, setupService) {

  setupService.ready.then(function() {

    var view = undefined,
        isSelected = {};

    $scope.strings = strings;

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

      globalSettings.setAccessPointSelection(view, {
        showAll: true,
        selectedBSSIDs: []
      });
    };

    $scope.unselectAll = function() {
      isSelected = {};

      globalSettings.setAccessPointSelection(view, {
        showAll: false,
        selectedBSSIDs: []
      });
    };

    $scope.sortSSID = utils.customSSIDSort;

    var onShow = function() {
      var settings = globalSettings.getAccessPointSelection(view);
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
        if (isSelected[BSSID]) {
          selection.push(BSSID);
        }
      }

      globalSettings.setAccessPointSelection(view, {
        showAll: false,
        selectedBSSIDs: selection
      });
    };

    var prepView = function() {
      $('.filterTable').css('height', dimensions.window.height * 0.6);
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
  });

}]);
