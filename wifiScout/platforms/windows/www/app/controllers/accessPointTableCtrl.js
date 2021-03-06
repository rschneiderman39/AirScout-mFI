"use strict";

/* Handles data updating for the access point table view */
app.controller('accessPointTableCtrl', ['$scope', 'accessPoints',
'globalSettings', 'accessPointTableState', 'setupSequence', function($scope,
accessPoints, globalSettings, accessPointTableState, setupSequence) {

  /* Wait until the device is ready before setting up the controller */
  setupSequence.done.then(function() {

    /* The time, in milliseconds, between data updates */
    var updateInterval = constants.updateIntervalSlow;

    $scope.strings = globals.strings;

    /* Array of AccessPoint objects to be displayed in the table */
    $scope.accessPoints = [];

    /* true: Sort direction reversed.  false: Normal behavior */
    $scope.sortReverse = undefined;

    $scope.sortPredicate = undefined;

    $scope.sortOrder = undefined;

    /* Triggered whenever a sort arrow is clicked. The sort predicate is changed to the new predicate.
       If the new predicate is the same as the current one, the sort direction is reversed. If 'SSID'
       is selected as the predicate, a custom ordering function is substituted instead.

       @param predicate: The new sort predicate (string or function)
    */
    $scope.order = function(predicate) {
      if (predicate === 'ssid') {
        $scope.sortOrder = utils.customSSIDSort;
      } else {
        $scope.sortOrder = predicate;
      }

      $scope.sortReverse = ($scope.sortPredicate === predicate) ? !$scope.sortReverse : false;
      $scope.sortPredicate = predicate;
    };

    function init() {
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
      $scope.$on(events.transitionDone, update);

      /* Ensure that a change to the access point selection in the Filtering
         options menu is immediately reflected in the table */
      $scope.$on(events.newSelection, update);

      /* Rescale on device rotate */
      $(window).on('resize', scaleView);

      /* Run cleanup on view unload */
      $scope.$on('$destroy', function() {
        /* Avoid duplicate event handlers */
        $(window).off('resize', scaleView);

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
      accessPointTableState.sortReverse($scope.sortReverse);
      accessPointTableState.sortPredicate($scope.sortPredicate);
    };

    /* Load the previously used selection and sort ordering. */
    function restoreState() {
      var predicate = accessPointTableState.sortPredicate();

      if (predicate === 'ssid') {
        $scope.sortOrder = utils.customSSIDSort;
      } else {
        $scope.sortOrder = predicate;
      }

      $scope.sortReverse = accessPointTableState.sortReverse();
      $scope.sortPredicate = predicate;
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
