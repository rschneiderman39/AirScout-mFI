app.controller('navCtrl', ['$scope', '$state', '$animate', '$timeout', 'globalSettings', 'nzTour', 'setupService',
function($scope, $state, $animate, $timeout, globalSettings, nzTour, setupService) {

    setupService.ready.then(function() {

      var prefs = {
        navShowInterval: 3000
      };

      var navTimeout = null,
          filterableViews = defaults.filterableViews;

      $scope.strings = strings;

      $scope.showNav = function() {
        clearTimeout(navTimeout);
        var navBar = $('#nav-bar');
        navBar.css('bottom', '0px');
        navTimeout = setTimeout(function() {
          navBar.css('bottom', dimensions.navBar.bottom);
        }, prefs.navShowInterval);
      };

      $scope.swipeTo = function(view, direction) {
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
              });
          });
        });
      };

      $scope.setView = function(view) {
        if (utils.isView(view)) {
          $('#view-title').html(strings.viewTitles[view]);
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

      $scope.swipeRight = function (view) {
        console.log("swiping right");
        defaults.swiped = true;
        $scope.setView(view);
      }

      $scope.swipeLeft = function (view) {
        console.log("swiping left");
        defaults.swiped = true;
        $scope.setView(view);
      }

      $scope.startTour = function() {
        globalSettings.updatesPaused(true);

        nzTour.start(tours[$state.current.name]).finally(function() {
          globalSettings.updatesPaused(false);
        });
      };

      var init = function() {
        $scope.setView(globalSettings.startingView());
      };

      init();
    });
}]);
