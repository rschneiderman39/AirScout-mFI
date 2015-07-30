angApp.controller('APTableCtrl', ['$scope', 'accessPoints',
'globalSettings', 'APTableState', 'setupService', function($scope,
accessPoints, globalSettings, APTableState, setupService) {

  setupService.ready.then(function() {
    $scope.strings = app.strings;
    $scope.selectedAPData = [];         // The AP objects representing the APs we want to display
    $scope.sortPredicate = undefined;    // Sorting options
    $scope.sortReverse = undefined;       // ..
    // Change the sort predicate, or reverse the sort direction
    $scope.order = function(predicate) {
      if (predicate === 'SSID') {
        $scope.sortReverse = ($scope.sortPredicate === $scope.sortSSID) ? !$scope.sortReverse : false;
        $scope.sortPredicate = $scope.sortSSID;
      } else {
        $scope.sortReverse = ($scope.sortPredicate === predicate) ? !$scope.sortReverse : false;
        $scope.sortPredicate = predicate;
      }
    };

    $scope.sortSSID = app.utils.hiddenSSIDSort;

    var showAll = true,
        selectedBSSIDs = [],
        UPDATE_INTERVAL = 1000;


    // Update the table whenever filter settings are changed
    var updateSelection = function(settings) {
      selectedBSSIDs = settings.selectedBSSIDs;
      showAll = settings.showAll;
      update();
      globalSettings.awaitNewSelection('APTable').done(updateSelection);
    };

    // Save our sort settings to the settings service
    var storeSortSettings = function() {
      APTableState.sortPredicate($scope.sortPredicate);
      APTableState.sortReverse($scope.sortReverse);
    };

    // Update the table now
    var update = function() {
      $scope.$apply(function() {
        if (showAll) {
          $scope.selectedAPData = accessPoints.getAll();
        } else {
          // Show only the APs whose BSSIDs match those we've selected
          $scope.selectedAPData = accessPoints.getSelected(selectedBSSIDs);
        }
      });
    };

    var prepView = function() {
      $('.table-striped thead').css('height', '40px');
      var tableHeadHeight = $('.table-striped thead').height();

      $('.table-striped thead').css('top', app.format.topBar.height);
      $('.table-striped tbody').css('top', app.format.topBar.height + tableHeadHeight);

      $('.table-striped tbody').css('height', (app.format.window.height - app.format.topBar.height - tableHeadHeight - 10) );
    };

    var init = function() {
      prepView();

      var selection = globalSettings.getSelection('APTable');
      selectedBSSIDs = selection.selectedBSSIDs;
      showAll = selection.showAll;

      var predicate = APTableState.sortPredicate();
      if (predicate === 'SSID') {
        $scope.sortPredicate = $scope.sortSSID;
      } else {
        $scope.sortPredicate = predicate;
      }
      $scope.sortReverse = APTableState.sortReverse();

      globalSettings.awaitNewSelection('APTable').done(updateSelection);

      var updateLoop = setInterval(update, UPDATE_INTERVAL);

      $scope.$on('$destroy', function() {
        clearInterval(updateLoop);
        storeSortSettings();
      });
    };

    init();
  });

}]);
