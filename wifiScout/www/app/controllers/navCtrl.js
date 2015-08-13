app.controller('navCtrl', ['$scope', '$state', '$animate', '$timeout', 'globalSettings', 'nzTour', 'setupService',
function($scope, $state, $animate, $timeout, globalSettings, nzTour, setupService) {

    setupService.ready.then(function() {

      var prefs = {
        navShowInterval: 3000
      };

      var navTimeout = null,
          tourInProgress = false,
          filterableViews = defaults.filterableViews;

      $scope.strings = strings;

      $scope.showNav = function() {
        clearTimeout(navTimeout);
        var navBar = $('#nav-bar');
        navBar.css('bottom', '0px');
        navTimeout = setTimeout(function() {
          navBar.css('bottom', 1 - $('#nav-bar').height());
        }, prefs.navShowInterval);
      };

      $scope.swipeTo = function(view, direction) {
        $scope.stopTour();

        globalSettings.updatesPaused(true);

        $('#view-title').html("");
        $('#current-view').css('visibility', 'hidden');

        $state.go(view).finally(function() {
          $('#current-view').addClass('anim-in-setup anim-slide-'+direction);
          $('#current-view').css('visibility', 'normal');

          $timeout(function() {
            $animate.setClass($('#current-view'), 'anim-in', 'anim-in-setup').finally(function() {
                $('#view-title').html(strings.viewTitles[view]);
                $('#current-view').removeClass('anim-in anim-slide-'+direction);
                globalSettings.updatesPaused(false);

                document.dispatchEvent(new Event(events.swipeDone));
              });
          });
        });
      };

      $scope.setView = function(view) {
        if (utils.isView(view)) {
          $scope.stopTour();

          $('#view-title').html(strings.viewTitles[view]);
          $state.go(view);
        }
      };

      $scope.startTour = function() {
        if ($state.current.name !== 'timeGraph' &&
            $state.current.name !== 'channelTable') {
          globalSettings.updatesPaused(true);
        };

        tourInProgress = true;
        nzTour.start(tours[$state.current.name]).finally(function() {
          tourInProgress = false;
          globalSettings.updatesPaused(false);
        });
      };

      $scope.stopTour = function() {
        if (tourInProgress) {
          nzTour.stop();
        }
      };

      var init = function() {
        $scope.setView(globalSettings.startingView());
      };

      init();
    });
}]);