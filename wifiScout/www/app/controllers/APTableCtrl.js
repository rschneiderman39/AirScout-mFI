/** Controller for the AP Table view.  Handles data fetching, table updating, and sorting. */
app.controller('APTableCtrl', ['$scope', 'accessPoints',
'globalSettings', 'APTableState', 'setupService', function($scope,
accessPoints, globalSettings, APTableState, setupService) {

  var prefs = {
    updateInterval: 1000
  };

  setupService.ready.then(function() {
    /** Make strings available in view */
    $scope.strings = globals.strings;
    /** AP data to be displayed in the table. @type {Array.<APData>} */
    $scope.selectedAPData = [];  
    /** Predicate to be used by angular sort. @type {string|function} */
    $scope.sortPredicate = undefined;   
    /** Reverse option to be used by angular sort. @type {string|function} */
    $scope.sortReverse = undefined;     
    
    /** Triggered whenever a sort arrow is clicked. The sort predicate is changed to the new predicate.
       If the new predicate is the same as the current one, the sort direction is reversed. If 'SSID'
       is selected as the predicate, a custom ordering function is substituted instead.
       
       @param {string|function} predicate - The new argument for angular orderBy.
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

    /** Used in place of a string predicate to sort access points by SSID. @type {function} */ 
    $scope.sortSSID = globals.utils.customSSIDSort; 

    var showAll = true;      /* True: display all access points regardless of selection.
                                False: display only selected access points. */
                             
    var selectedBSSIDs = []; /* Array of BSSID strings representing the user's current access
                                point selection */


    /** Update the locally stored selection whenever the user changes the selection with the
       filter menu.
       
       @param {Selection} newSelection - The new selection.
    */
    var updateSelection = function(newSelection) {
      selectedBSSIDs = newSelection.selectedBSSIDs;
      showAll = newSelection.showAll;
      update();
      globalSettings.awaitNewSelection('APTable').done(updateSelection);
    };

    /** Remember our sort settings for next time. */
    var storeSortSettings = function() {
      APTableState.sortPredicate($scope.sortPredicate);
      APTableState.sortReverse($scope.sortReverse);
    };

    /** Pull in new data and update the table. */
    var update = function() {
      $scope.$apply(function() {
        if (showAll) {
          $scope.selectedAPData = accessPoints.getAll();
        } else {
          $scope.selectedAPData = accessPoints.getSelected(selectedBSSIDs);
        }
      });
    };

    /* Manually scale the view to the device where needed. */
    var prepView = function() {
      $('.table-striped thead').css('height', '40px');
      var tableHeadHeight = $('.table-striped thead').height();

      $('.table-striped thead').css('top', globals.format.topBar.height);
      $('.table-striped tbody').css('top', globals.format.topBar.height + tableHeadHeight);

      $('.table-striped tbody').css('height', (globals.format.window.height - globals.format.topBar.height - tableHeadHeight - 10) );
    };

    /** Perform controller setup. */
    var init = function() {
      prepView();

      /** Load the current access point selection for this view */
      var selection = globalSettings.getSelection('APTable');
      selectedBSSIDs = selection.selectedBSSIDs;
      showAll = selection.showAll;

      /** Load the sort settings from last time view was used. */
      var predicate = APTableState.sortPredicate();
      if (predicate === 'SSID') {
        $scope.sortPredicate = $scope.sortSSID;
      } else {
        $scope.sortPredicate = predicate;
      }
      $scope.sortReverse = APTableState.sortReverse();

      globalSettings.awaitNewSelection('APTable').done(updateSelection);

      var updateLoop = setInterval(update, prefs.updateInterval);

      /** Runs on view unload */
      $scope.$on('$destroy', function() {
        clearInterval(updateLoop);
        storeSortSettings();
      });
    };

    init();
  });

}]);
