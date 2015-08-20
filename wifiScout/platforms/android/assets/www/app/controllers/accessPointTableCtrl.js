"use strict";

app.controller('accessPointTableCtrl', ['$scope', '$timeout', 'accessPoints',
'globalSettings', 'accessPointTableState', 'setupService', function($scope, $timeout,
accessPoints, globalSettings, accessPointTableState, setupService) {

  setupService.ready.then(function() {

    var updateInterval;

    var showAll; /* True: display all access points regardless of selection.
                           False: display only selected access points. */

    var selectedMACs = []; /* Current access point selection. @type {{Array.<string>}} */

    $scope.strings = strings;
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

    /* Update the locally stored selection whenever the user changes the selection with the
       filter modal.

       @param {{showAll: boolean, selectedMACs: Array.<string>}} newSelection - The new selection.
    */

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
      document.addEventListener(events.newAccessPointSelection['accessPointTable'], updateSelection);

      $scope.$on('$destroy', function() {
        clearInterval(updateLoop);
        document.removeEventListener(events.newAccessPointSelection['accessPointTable'], updateSelection);

        saveState();
      });
    };

    function updateSelection() {
      var selection = globalSettings.getAccessPointSelection('accessPointTable');

      selectedMACs = selection.macAddrs;
      showAll = selection.showAll;

      update();
    };

    function update() {
      if (! globalSettings.updatesPaused()) {
        accessPoints.getAll().done(function(results) {
          $timeout(function() {
            if (showAll) {
              $scope.accessPoints = results;
            } else {
              $scope.accessPoints =
              utils.accessPointSubset(results, selectedMACs);
            }
          });
        });
      }
    };

    /* Store current sort ordering. */
    function saveState() {
      accessPointTableState.sortPredicate($scope.sortPredicate);
      accessPointTableState.sortReverse($scope.sortReverse);
    };

    /* Load the previously used selection and sort ordering. */
    function restoreState() {
      var selection = globalSettings.getAccessPointSelection('accessPointTable');
      selectedMACs = selection.macAddrs;
      showAll = selection.showAll;

      var predicate = accessPointTableState.sortPredicate();
      if (predicate === 'SSID') {
        $scope.sortPredicate = $scope.sortSSID;
      } else {
        $scope.sortPredicate = predicate;
      }
      $scope.sortReverse = accessPointTableState.sortReverse();
    };

    /* Manually scale the view to the device where needed. */
    function prepView() {
      var contentHeight = $(window).height() - $('#top-bar').height() - $('.table thead').height();
      $('#table-content').height(contentHeight);
    };

    init();
  });

}]);
