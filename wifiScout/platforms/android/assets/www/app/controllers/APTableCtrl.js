app.controller('APTableCtrl', ['$scope', '$timeout', 'accessPoints',
'globalSettings', 'APTableState', 'setupService', function($scope, $timeout,
accessPoints, globalSettings, APTableState, setupService) {

  setupService.ready.then(function() {

    var prefs = {
      updateInterval: 2000
    };

    var showAll = true; /* True: display all access points regardless of selection.
                           False: display only selected access points. */

    var selectedBSSIDs = []; /* Current access point selection. @type {{Array.<string>}} */

    $scope.strings = strings;
    $scope.selectedAPData = [];       // Array of AP data objects to be displayed
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

       @param {{showAll: boolean, selectedBSSIDs: Array.<string>}} newSelection - The new selection.
    */
    var updateSelection = function() {
      var selection = globalSettings.getAccessPointSelection('APTable');

      console.log('updating APTable selection to: ' + JSON.stringify(selection));
      selectedBSSIDs = selection.selectedBSSIDs;
      showAll = selection.showAll;

      update();
    };

    /* Store current sort ordering. */
    var saveState = function() {
      APTableState.sortPredicate($scope.sortPredicate);
      APTableState.sortReverse($scope.sortReverse);
    };

    /* Load the previously used selection and sort ordering. */
    var restoreState = function() {
      var selection = globalSettings.getAccessPointSelection('APTable');
      selectedBSSIDs = selection.selectedBSSIDs;
      showAll = selection.showAll;

      var predicate = APTableState.sortPredicate();
      if (predicate === 'SSID') {
        $scope.sortPredicate = $scope.sortSSID;
      } else {
        $scope.sortPredicate = predicate;
      }
      $scope.sortReverse = APTableState.sortReverse();
    };

    /* Pull in new data and update the table. */
    var update = function() {
      $timeout(function() {
        if (! globalSettings.updatesPaused()) {
          if (showAll) {
            $scope.selectedAPData = accessPoints.getAll();
          } else {
            $scope.selectedAPData = accessPoints.getSelected(selectedBSSIDs);
          }
        }
      });
    };

    /* Manually scale the view to the device where needed. */
    var prepView = function() {
      $('.table-striped thead').css('height', '40px');
      var tableHeadHeight = $('.table-striped thead').height();

      $('.table-striped tbody').css('top', dimensions.topBar.height + tableHeadHeight);
    };

    var init = function() {
      prepView();

      restoreState();

      var updateLoop = setInterval(update, prefs.updateInterval);

      document.addEventListener(events.newAccessPointSelection['APTable'], updateSelection);

      $scope.$on('$destroy', function() {
        clearInterval(updateLoop);
        saveState();
      });
    };

    init();
  });

}]);
