"use strict";

app.controller('filterModalCtrl', ['$scope', '$state', '$filter', 'accessPoints',
'globalSettings', 'setupService', function($scope, $state, $filter, accessPoints,
globalSettings, setupService) {

  setupService.ready.then(function() {

    var view = undefined,
        isSelected = {};

    $scope.strings = globals.strings;

    $scope.accessPoints = [];

    $scope.toggleSelected = function(ap) {
      if (! isSelected[ap.mac]) {
        isSelected[ap.mac] = true;
      } else {
        isSelected[ap.mac] = false;
      }

      updateSelection();
    };

    $scope.isSelected = function(ap) {
      return isSelected[ap.mac];
    };

    // Select all APs, and show any new AP that later becomes visible
    $scope.selectAll = function() {
      $.each($scope.accessPoints, function(i, ap) {
        isSelected[ap.mac] = true;
      });

      apSelection(new AccessPointSelection([], true));
    };

    $scope.unselectAll = function() {
      $.each($scope.accessPoints, function(i, ap) {
        isSelected[ap.mac] = false;
      });

      apSelection(new AccessPointSelection([], false));
    };

    $scope.sortSSID = utils.customSSIDSort;

    function init() {
      prepView();
      view = $state.current.name;
    };

    function prepView() {
      $('#modal-list').css('height', $(window).height() * 0.6);
      $('#filter-modal').on('show.bs.modal', onShow);
    };

    function onShow() {
      $scope.stopTour();

      accessPoints.getAll().done(function(results) {
        $scope.$apply(function() {
          var selectedAccessPoints;

          $scope.accessPoints = results;

          selectedAccessPoints = apSelection().apply(results);

          $.each(selectedAccessPoints, function(i, ap) {
            isSelected[ap.mac] = true;
          });
        });
      });
    };

    function apSelection(newSelection) {
      if (newSelection === undefined) {
        return globalSettings.accessPointSelection();
      }

      globalSettings.accessPointSelection(newSelection);
    };

    function updateSelection() {
      var selectedMacs = [];

      $.each(isSelected, function(mac, selected) {
        if (selected) selectedMacs.push(mac);
      });

      apSelection(new AccessPointSelection(selectedMacs, false));
    };

    init();
  });

}]);
