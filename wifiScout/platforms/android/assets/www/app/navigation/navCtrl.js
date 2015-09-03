"use strict";

/* Handles help menu interaction and view switching */
app.controller('navCtrl', ['$rootScope', '$scope', '$state', '$animate', '$timeout',
'globals', 'globalSettings', 'nzTour', 'setupSequence',
function($rootScope, $scope, $state, $animate, $timeout, globals, globalSettings,
nzTour, setupSequence) {

  /* Wait for app setup to complete before setting up the controller */
  setupSequence.done.then(function() {

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

    /* Change the view and perform a slide in animation

    @param view - the name of the target view
    @param direction - the direction from which the new view will slide in
                       ('left' or 'right')
    */
    $scope.swipeTo = function(view, direction) {
      $scope.stopTour();

      /* Hide the current view and view title */
      $('#view-title').html("");
      $('#current-view').css('visibility', 'hidden');

      /* Switch views */
      $state.go(view).finally(function() {
        /* Move the view just past the edge of the screen */
        $('#current-view').addClass('anim-in-setup anim-slide-'+direction);
        $('#current-view').css('visibility', 'normal');

        /* Wait for an angular digest cycle !!IMPORTANT */
        $timeout(function() {
          /* Animate the view back in */
          $animate.setClass($('#current-view'), 'anim-in', 'anim-in-setup').finally(function() {
              /* Restore view title and remove all animation classes */
              $('#view-title').html(globals.strings.viewTitles[view]);
              $('#current-view').removeClass('anim-in anim-slide-'+direction);

              /* Let everyone know we're done with the transition */
              $rootScope.$broadcast(globals.events.transitionDone);
            });
        });
      });
    };

    /* Change the view and perform a fade in animation

    @param view - the name of the target view
    */
    $scope.setView = function(view) {
      if (view !== $state.current.name) {
        $scope.stopTour();

        /* Hide the current view and view title */
        $('#view-title').html("");
        $('#current-view').css('visibility', 'hidden');

        /* Switch views */
        $state.go(view).finally(function() {
          /* Restore view title */
          $('#view-title').html(globals.strings.viewTitles[view]);

          /* Make the view transparent */
          $('#current-view').addClass('anim-in-setup anim-fade');
          $('#current-view').css('visibility', 'normal');

          /* Wait for an angular digest cycle !!IMPORTANT */
          $timeout(function() {
            /* Fade the view in */
            $animate.setClass($('#current-view'), 'anim-in', 'anim-in-setup').finally(function() {
                /* Remove all animation classes */
                $('#current-view').removeClass('anim-in anim-fade');

                /* Let everyone know we're done with the transition */
                $rootScope.$broadcast(globals.events.transitionDone);
            });
          });
        });
      }
    };

    /* Start the help modal sequence for the current view */
    $scope.startTour = function() {
      tourInProgress = true;

      nzTour.start(globals.tours[$state.current.name]).finally(function() {
        tourInProgress = false;
      });
    };

    /* If a help modal is open, stop the help modal sequence */
    $scope.stopTour = function() {
      if (tourInProgress) {
        nzTour.stop();
      }
    };

    function init() {
      /* Start the app in the desired view */
      $scope.setView(globals.defaults.startingView);

      $(window).on('resize', function() {
        $scope.stopTour();
        $rootScope.$broadcast(globals.events.orientationChanged);
      });
    };

    init();
  });
}]);
