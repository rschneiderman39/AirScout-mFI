"use strict";

/* Handles data updating for the access point table view */
app.controller('accessPointTableCtrl', ['$scope', 'accessPoints',
'globalSettings', 'accessPointTableState', 'setupService', function($scope,
accessPoints, globalSettings, accessPointTableState, setupService) {

  /* Wait until the device is ready before setting up the controller */
  setupService.ready.then(function() {

    /* The time, in milliseconds, between data updates */
    var updateInterval;

    $scope.strings = globals.strings;

    /* Array of AccessPoint objects to be displayed in the table */
    $scope.accessPoints = [];

    /* String or function used by angular to sort the table elements */
    $scope.sortPredicate = undefined;

    /* true: Sort direction reversed.  false: Normal behavior */
    $scope.sortReverse = undefined;

    /* Triggered whenever a sort arrow is clicked. The sort predicate is changed to the new predicate.
       If the new predicate is the same as the current one, the sort direction is reversed. If 'SSID'
       is selected as the predicate, a custom ordering function is substituted instead.

       @param predicate: The new sort predicate (string or function)
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

    /* Used in place of a string predicate to sort access points by SSID.
       In its current implementation, the custom sort makes hidden access
       points appear at the bottom of the table instead of the top */
    $scope.sortSSID = utils.customSSIDSort;

    function init() {
      /* Choose an appropriate update interval.  Too frequent updates seem
         to cause problems with touch gesture recognition */
      if (accessPoints.count() < constants.moderateThresh) {
        updateInterval = constants.updateIntervalNormal;
      } else if (accessPoints.count() < constants.highThresh) {
        updateInterval = constants.updateIntervalSlow;
      } else {
        updateInterval = constants.updateIntervalVerySlow;
      }

      scaleView();
      restoreState();

      /* Start the update loop */
      var updateLoop = setInterval(function() {
        if (! globalSettings.updatesPaused()) {
          update();
        }
      }, updateInterval);

      /* Wait until the transition animation is done before performing
         first update */
      $(document).one(events.transitionDone, update);

      /* Ensure that a change to the access point selection in the Filtering
         options menu is immediately reflected in the table */
      $(document).on(events.newSelection, update);

      /* Rescale on device rotate */
      $(window).on('resize', scaleView);

      /* Run cleanup on view unload */
      $scope.$on('$destroy', function() {
        /* Avoid duplicate event handlers */
        $(document).off(events.newSelection);
        $(window).off('resize');

        /* Stop updating */
        clearInterval(updateLoop);

        saveState();
      });
    };

    /* @returns the AccessPointSelection object containing the current
       access point selection */
    function apSelection() {
      return globalSettings.accessPointSelection();
    };

    function update() {
      if (globals.debug) console.log('updating ap table');

      accessPoints.getAll().done(function(results) {
        /* Update DOM */
        $scope.$apply(function() {
          $scope.accessPoints = apSelection().apply(results);
        });
      });
    };

    /* Store current sort ordering. */
    function saveState() {
      accessPointTableState.sortPredicate($scope.sortPredicate);
      accessPointTableState.sortReverse($scope.sortReverse);
    };

    /* Load the previously used selection and sort ordering. */
    function restoreState() {
      var predicate = accessPointTableState.sortPredicate();

      if (predicate === 'SSID') {
        $scope.sortPredicate = $scope.sortSSID;
      } else {
        $scope.sortPredicate = predicate;
      }

      $scope.sortReverse = accessPointTableState.sortReverse();
    };

    /* Manually scale the view to the device where needed. */
    function scaleView() {
      if (globals.debug) console.log('scaling ap table');

      var contentHeight = $(window).height() - $('#top-bar').height()
                          - $('.table thead').height();
      $('#table-content').height(contentHeight);
    };

    init();
  });

}]);
