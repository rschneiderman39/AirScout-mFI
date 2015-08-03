app.controller('navCtrl', ['$scope', '$state', 'globalSettings', 'nzTour', 'setupService',
function($scope, $state, globalSettings, nzTour, setupService) {

  var prefs = {
    navShowInterval: 2000
  };

  setupService.ready.then(function() {
    $scope.strings = strings;

    $scope.showNav = function() {
      clearTimeout(navTimeout);
      var navBar = $('#nav-bar');
      navBar.css('bottom', '0px');
      navTimeout = setTimeout(function() {
        navBar.css('bottom', dimensions.navBar.bottom);
      }, prefs.navShowInterval);
    };

    $scope.setView = function(view) {
      if (utils.isView(view)) {
        document.getElementById('view-title').innerHTML = strings.viewTitles[view];
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
      nzTour.start(tours[$state.current.name]);
    };

    var navTimeout = null,
        filterableViews = defaults.filterableViews;

    var init = function() {
      $scope.setView(globalSettings.startingView());
    };

    init();
  });
}]);
