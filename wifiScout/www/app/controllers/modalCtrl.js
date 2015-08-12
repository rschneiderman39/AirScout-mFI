app.controller('modalCtrl', ['$scope', '$state', 'accessPoints', 'globalSettings',
'setupService', function($scope, $state, accessPoints, globalSettings, setupService) {

  setupService.ready.then(function() {

    var view = undefined,
        isSelected = {};

    $scope.strings = strings;

    $scope.accessPoints = [];

    $scope.toggleSelected = function(AP) {
      isSelected[AP.MAC] = isSelected[AP.MAC] ? false : true;
      sendSelection();
    };

    $scope.isSelected = function(AP) {
      return isSelected[AP.MAC];
    };

    // Select all APs, and show any new AP that later becomes visible
    $scope.selectAll = function() {
      for (var i = 0; i < $scope.accessPoints.length; ++i) {
        isSelected[$scope.accessPoints[i].MAC] = true;
      }

      globalSettings.setAccessPointSelection(view, {
        showAll: true,
        macAddrs: []
      });
    };

    $scope.unselectAll = function() {
      isSelected = {};

      globalSettings.setAccessPointSelection(view, {
        showAll: false,
        macAddrs: []
      });
    };

    $scope.sortSSID = utils.customSSIDSort;

    var onShow = function() {
      $scope.stopTour();

      var selection = globalSettings.getAccessPointSelection(view);

      accessPoints.getAll().done(function(results) {
        $scope.$apply(function() {
          $scope.accessPoints = results;

          if (selection.showAll) {
            for (var i = 0; i < $scope.accessPoints.length; ++i) {
              isSelected[$scope.accessPoints[i].MAC] = true;
            }

          } else {
            for (var i = 0; i < selection.macAddrs.length; ++i) {
              isSelected[selection.macAddrs[i]] = true;
            }
          }
        });
      });
    };

    var sendSelection = function() {
      var selection = [];

      for (var macAddr in isSelected) {
        if (isSelected[macAddr]) {
          selection.push(macAddr);
        }
      }

      globalSettings.setAccessPointSelection(view, {
        showAll: false,
        macAddrs: selection
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
