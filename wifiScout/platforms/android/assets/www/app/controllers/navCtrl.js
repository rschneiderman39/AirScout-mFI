angApp.controller('navCtrl', ['$scope', '$state', 'globalSettings', 'nzTour', 'setupService',
function($scope, $state, globalSettings, nzTour, setupService) {

    setupService.ready.then(function() {
      $scope.strings = app.strings;

      $scope.showNav = function() {
        clearTimeout(navTimeout);
        var navBar = $('#bottom-bar');
        navBar.css('bottom', '0px');
        navTimeout = setTimeout(function() {
          navBar.css('bottom', app.format.navBar.bottom);
        }, NAV_SHOW_INTERVAL);
      };

      $scope.setView = function(view) {
        if (app.utils.isView(view)) {
          document.getElementById('view-title').innerHTML = app.strings.viewTitles[view];
          $state.go(view);
        }
      };

      $scope.usesFilterBtn = function() {
        var view = $state.current.name;
        for (var i = 0; i < filterableViews.length; ++i) {
          if (view === filterableViews[i]) return true;
        }
        return false;
      };

      $scope.startTour = function() {
        nzTour.start(app.tours[$state.current.name]);
      };

      var navTimeout = null,
          NAV_SHOW_INTERVAL = 2000,
          filterableViews = app.defaults.filterableViews;

      var init = function() {
        $scope.setView(globalSettings.startingView());
      };

      init();
    });
}]);
