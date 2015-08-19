"use strict";

app.controller('modalCtrl', ['$scope', '$state', 'accessPoints', 'globalSettings',
'setupService', function($scope, $state, accessPoints, globalSettings, setupService) {

  setupService.ready.then(function() {

    var view = undefined;

    $scope.strings = globals.strings;

    $scope.accessPoints = [];

    $scope.toggleSelected = function(ap) {
      var currentSelection = mySelection(),
          newSelection,
          macAddrs = [];

      if (currentSelection.isSelected(ap.mac)) {

        $.each($scope.accessPoints, function(i, accPt) {
          if (currentSelection.isSelected(accPt.mac) && ap.mac !== accPt.mac) {
            macAddrs.push(accPt.mac);
          }
        });

        newSelection = new AccessPointSelection(macAddrs, false);

      } else {
        newSelection = mySelection().add(ap.mac);
      }

      mySelection(newSelection);
    };

    $scope.isSelected = function(ap) {
      return mySelection().isSelected(ap.mac);
    };

    // Select all APs, and show any new AP that later becomes visible
    $scope.selectAll = function() {
      mySelection(new AccessPointSelection([], true));
    };

    $scope.unselectAll = function() {
      mySelection(new AccessPointSelection([], false));
    };

    $scope.sortSSID = utils.customSSIDSort;

    function mySelection(newSelection) {
      if (newSelection === undefined) {
        return globalSettings.getAccessPointSelection(view);
      } else {
        globalSettings.setAccessPointSelection(view, newSelection);
      }
    };

    function onShow() {
      $scope.stopTour();

      accessPoints.getAll().done(function(results) {
        $scope.$apply(function() {
          $scope.accessPoints = results;
        });
      });
    };

    function prepView() {
      $('#modal-list').css('height', $(window).height() * 0.6);
      $('#filter-modal').on('show.bs.modal', onShow);
    };

    function init() {
      prepView();
      view = $state.current.name;
    };

    init();
  });

}]);
