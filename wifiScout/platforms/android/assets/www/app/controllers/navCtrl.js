app.controller('navCtrl', ['$scope', '$state', 'globalSettings', 'nzTour', 'cordovaService',
function($scope, $state, globalSettings, nzTour, cordovaService) {

    cordovaService.ready.then(function() {
        $scope.showNav = function() {
          clearTimeout(navTimeout);
          var navBar = $('#bottom-bar');
          navBar.css('bottom', '0px');
          navTimeout = setTimeout(function() {
            navBar.css('bottom', document.bottomBarBottom);
          }, NAV_SHOW_INTERVAL);
        };

        $scope.setView = function(view) {
          if (isView(view)) {
            document.getElementById('view-title').innerHTML = VIEW_TITLES[view];
            $state.go(view);
          }
        };

        $scope.usesFilterBtn = function() {
          var view = $state.current.name;
          for (var i = 0; i < FILTERABLE_VIEWS.length; ++i) {
            if (view === FILTERABLE_VIEWS[i]) return true;
          }
          return false;
        };

        $scope.startTour = function() {
          switch ($state.current.name) {
            case "channelTable":
              nzTour.start(document.channelTableTour);
            break;
            case "APTable":
              nzTour.start(document.apTableTour);
            break;
            case "timeGraph":
              nzTour.start(document.timeGraphTour);
            break;
            case "signalStrength":
              nzTour.start(document.signalStrengthTour);
            break;
            case "channelGraph":
              nzTour.start(document.channelGraphTour);
            break;
          }

          intro.start();
        };

        var navTimeout = null,
            NAV_SHOW_INTERVAL = 2000;

        var init = function() {
          $scope.setView(globalSettings.startingView());
        };

        init();
      });
}]);