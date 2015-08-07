app.controller('modalCtrl', ['$scope', '$state', 'accessPoints', 'globalSettings',
'setupService', function($scope, $state, accessPoints, globalSettings, setupService) {

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
      $('#modal-list').css('height', $(window).height() * 0.6);
      $('#filter-modal').on('show.bs.modal', onShow);
    };

    var init = function() {
      prepView();
      view = $state.current.name;
    };

    init();
  });

}]);
