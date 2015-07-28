app.controller('APTableCtrl', ['$scope', 'accessPoints', 'utils',
  'globalSettings', 'tableSettings', 'cordovaService',
  function($scope, accessPoints, utils, globalSettings,
    tableSettings, cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        // Settings for this session
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

        $scope.sortSSID = utils.hiddenSSIDSort;

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
          tableSettings.sortPredicate($scope.sortPredicate);
          tableSettings.sortReverse($scope.sortReverse);
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

          $('.table-striped thead').css('top', document.topBarHeight);
          $('.table-striped tbody').css('top', document.topBarHeight + tableHeadHeight);

          $('.table-striped tbody').css('height', (document.deviceHeight - document.topBarHeight - tableHeadHeight - 10) );
        };

        var init = function() {
          prepView();

          var selection = globalSettings.getSelection('APTable');
          selectedBSSIDs = selection.selectedBSSIDs;
          showAll = selection.showAll;

          var predicate = tableSettings.sortPredicate();
          if (predicate === 'SSID') {
            $scope.sortPredicate = $scope.sortSSID;
          } else {
            $scope.sortPredicate = predicate;
          }
          $scope.sortReverse = tableSettings.sortReverse();

          globalSettings.awaitNewSelection('APTable').done(updateSelection);

          var updateLoop = setInterval(update, UPDATE_INTERVAL);

          $scope.$on('$destroy', function() {
            clearInterval(updateLoop);
            storeSortSettings();
          });
        };

        /* INIT */

        init();
      },
      function rejected() {
        console.log("APTableCtrl is unavailable because Cordova is not loaded.");
      }
    );
  }]);
