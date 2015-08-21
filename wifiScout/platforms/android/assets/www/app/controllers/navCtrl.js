"use strict";

app.controller('navCtrl', ['$scope', '$state', '$animate', '$timeout',
  'globalSettings', 'nzTour', 'setupService',
  function($scope, $state, $animate, $timeout, globalSettings, nzTour,
    setupService) {

    setupService.ready.then(function() {

      var prefs = {
        navShowInterval: 3000
      };

      var navTimeout = null,
          tourInProgress = false;

      $scope.strings = globals.strings;

      $scope.showNav = function() {
        clearTimeout(navTimeout);

        var navBar = $('#nav-bar');
        navBar.css('bottom', '0px');
        navTimeout = setTimeout(function() {
          navBar.css('bottom', 1 - $('#nav-bar').height());
        }, 3000);
      };

      $scope.displayFilterBtn = function() {
        return ($state.current.name === 'timeGraph' ||
                $state.current.name === 'accessPointTable' ||
                $state.current.name === 'signalStrength');
      };

      $scope.displayHelpBtn = function() {
        return $state.current.name !== 'settings';
      };

      $scope.swipeTo = function(view, direction) {
        $scope.stopTour();

        $('#view-title').html("");
        $('#current-view').css('visibility', 'hidden');

        $state.go(view).finally(function() {
          $('#current-view').addClass('anim-in-setup anim-slide-'+direction);
          $('#current-view').css('visibility', 'normal');

          $timeout(function() {
            $animate.setClass($('#current-view'), 'anim-in', 'anim-in-setup').finally(function() {
                $('#view-title').html(globals.strings.viewTitles[view]);
                $('#current-view').removeClass('anim-in anim-slide-'+direction);

                document.dispatchEvent(new Event(events.transitionDone));
              });
          });
        });
      };

      $scope.setView = function(view) {
        if (view !== $state.current.name) {
          $scope.stopTour();

          $('#view-title').html("");
          $('#current-view').css('visibility', 'hidden');

          $state.go(view).finally(function() {
            $('#view-title').html(globals.strings.viewTitles[view]);

            $('#current-view').addClass('anim-in-setup anim-fade');
            $('#current-view').css('visibility', 'normal');

            $timeout(function() {
              $animate.setClass($('#current-view'), 'anim-in', 'anim-in-setup').finally(function() {
                  $('#current-view').removeClass('anim-in anim-fade');

                  document.dispatchEvent(new Event(events.transitionDone));
              });
            });
          });
        }
      };

      $scope.startTour = function() {
        tourInProgress = true;

        nzTour.start(tours[$state.current.name]).finally(function() {
          tourInProgress = false;
        });
      };

      $scope.stopTour = function() {
        if (tourInProgress) {
          nzTour.stop();
        }
      };

      function init() {
        $scope.setView(defaults.startingView);

        new Hammer($('#nav-bar')[0])
          .on('panup', $scope.showNav)
          .on('tap', $scope.showNav);
      };

      init();
    });
}]);
