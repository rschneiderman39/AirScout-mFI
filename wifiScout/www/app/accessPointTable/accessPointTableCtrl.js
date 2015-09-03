"use strict";

/* Handles data updating for the access point table view */
app.controller('accessPointTableCtrl', ['$scope', 'globals', 'utils',
'accessPoints', 'globalSettings', 'accessPointTableState', 'setupSequence',
function($scope, globals, utils, accessPoints, globalSettings,
accessPointTableState, setupSequence) {

  /* Wait for app setup to complete before setting up the controller */
  setupSequence.done.then(function() {

    /* The time, in milliseconds, between data updates */
    var updateInterval = globals.updateIntervals.accessPointTable;

    init();

    function init() {
      $scope.strings = globals.strings;

      /* Array of AccessPoint objects to be displayed in the table */
      $scope.accessPoints = [];

      /* true: Sort direction reversed.  false: Normal behavior */
      $scope.sortReverse = undefined;

      $scope.sortPredicate = undefined;

      $scope.sortOrder = undefined;

      $scope.inPortrait = function() {
        return utils.getOrientation() === 'portrait';
      };

      $scope.inLandscape = function() {
        return utils.getOrientation() === 'landscape';
      };

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
      $scope.$on(globals.events.transitionDone, update);

      /* Ensure that a change to the access point selection in the Filtering
         options menu is immediately reflected in the table */
      $scope.$on(globals.events.newSelection, update);

      /* Rescale on device rotate */
      $scope.$on(globals.events.orientationChange, scaleView);

      /* Run cleanup on view unload */
      $scope.$on('$destroy', function() {
        /* Stop updating */
        clearInterval(updateLoop);

        saveState();
      });
    };

    function update() {
      if (globals.debug) console.log('updating ap table');

      accessPoints.getAll().then(function(results) {
        /* Update DOM */
        $scope.$apply(function() {
          $scope.accessPoints = globalSettings.accessPointSelection()
                                 .apply(results);
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
      $('tbody').height($('.view-wrapper').height() - $('thead').height());
    };

  });

}]);
