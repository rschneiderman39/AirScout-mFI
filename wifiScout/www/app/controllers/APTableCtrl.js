"use strict";

app.controller('APTableCtrl', ['$scope', '$timeout', 'accessPoints',
'globalSettings', 'APTableState', 'setupService', function($scope, $timeout,
accessPoints, globalSettings, APTableState, setupService) {

  setupService.ready.then(function() {

    var updateInterval;

    $scope.strings = globals.strings;
    $scope.accessPoints = [];       // Array of AP data objects to be displayed
    $scope.sortPredicate = undefined; // String or function used by angular to order the elements.
    $scope.sortReverse = undefined;   // true: Sort direction reversed.  false: Normal behavior.

    /* Triggered whenever a sort arrow is clicked. The sort predicate is changed to the new predicate.
       If the new predicate is the same as the current one, the sort direction is reversed. If 'SSID'
       is selected as the predicate, a custom ordering function is substituted instead.

       @param {string|function} predicate: The new sort .
    */
    $scope.order = function(predicate) {
      if (predicate === 'SSID') {
        $scope.sortReverse = ($scope.sortPredicate === $scope.sortSSID) ? !$scope.sortReverse : false;
        $scope.sortPredicate = $scope.sortSSID;
      } else {
        $scope.sortReverse = ($scope.sortPredicate === predicate) ? !$scope.sortReverse : false;
        $scope.sortPredicate = predicate;
      }
    };

    /* Used in place of a string predicate to sort access points by SSID. @type {function} */
    $scope.sortSSID = utils.customSSIDSort;

    function init() {
      if (accessPoints.count() < constants.moderateThresh) {
        updateInterval = constants.updateIntervalNormal;

      } else if (accessPoints.count() < constants.highThresh) {
        updateInterval = constants.updateIntervalSlow;
      } else {
        updateInterval = constants.updateIntervalVerySlow;
      }

      prepView();

      restoreState();

      function firstUpdate() {
        update();
        document.removeEventListener(events.swipeDone, firstUpdate);
      }

      if (globalSettings.updatesPaused()) {
        document.addEventListener(events.swipeDone, firstUpdate);
      } else {
        update();
      }

      var updateLoop = setInterval(update, updateInterval);
      document.addEventListener(events.newSelection, update);

      $scope.$on('$destroy', function() {
        clearInterval(updateLoop);
        document.removeEventListener(events.newSelection, update);
        saveState();
      });
    };

    function apSelection() {
      return globalSettings.accessPointSelection();
    };

    function update() {
      if (! globalSettings.updatesPaused()) {
        accessPoints.getAll().done(function(results) {
          $timeout(function() {
            $scope.accessPoints = apSelection().apply(results);
          });
        });
      }
    };

    /* Store current sort ordering. */
    function saveState() {
      APTableState.sortPredicate($scope.sortPredicate);
      APTableState.sortReverse($scope.sortReverse);
    };

    /* Load the previously used selection and sort ordering. */
    function restoreState() {
      var predicate = APTableState.sortPredicate();

      if (predicate === 'SSID') {
        $scope.sortPredicate = $scope.sortSSID;
      } else {
        $scope.sortPredicate = predicate;
      }

      $scope.sortReverse = APTableState.sortReverse();
    };

    /* Manually scale the view to the device where needed. */
    function prepView() {
      var contentHeight = $(window).height() - $('#top-bar').height() - $('.table thead').height();
      $('#table-content').height(contentHeight);
    };

    init();
  });

}]);
