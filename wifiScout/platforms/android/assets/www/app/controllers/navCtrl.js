"use strict";

/* Handles tours and view switching */
app.controller('navCtrl', ['$scope', '$state', '$animate', '$timeout',
'globalSettings', 'nzTour', 'setupService',
function($scope, $state, $animate, $timeout, globalSettings, nzTour,
  setupService) {

  /* Wait until the device is ready before setting up the controller */
  setupService.ready.then(function() {

    var prefs = {
      /* Number of milliseconds for which to display the navbar before
         autohiding it */
      navShowInterval: 3000
    };

    var navTimeout = null,
        tourInProgress = false;

    $scope.strings = globals.strings;

    /* Show the navbar.  It the navbar is already being displayed,
       restart the timer. */
    $scope.showNav = function() {
      clearTimeout(navTimeout);

      var navBar = $('#nav-bar');

      /* Show navbar */
      navBar.css('-webkit-transform', 'translateY(-100%)');

      /* After timeout expires, autohide navbar */
      navTimeout = setTimeout(function() {
        navBar.css('-webkit-transform', 'translateY(-40%)');
      }, 3000);
    };

    /* @returns - true: if the current view uses the filter menu.
                  false: otherwise.
    */
    $scope.displayFilterBtn = function() {
      return ($state.current.name === 'timeGraph' ||
              $state.current.name === 'accessPointTable' ||
              $state.current.name === 'signalStrength');
    };

    /* @returns - true: if the current view needs the help button.
                  false: otherwise.
    */
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

              $(document).trigger(events.transitionDone);
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

                $(document).trigger(events.transitionDone);
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
    };

    init();
  });
}]);
