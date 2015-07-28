app.controller('navCtrl', ['$scope', '$state', 'globalSettings', 'cordovaService',
  function($scope, $state, globalSettings, cordovaService) {
    cordovaService.ready.then(
      function resolved() {
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

        $scope.usesFilterBtn = function(view) {
          for (var i = 0; i < FILTERABLE_VIEWS.length; ++i) {
            if (view === FILTERABLE_VIEWS[i]) return true;
          }
          return false;
        };

        $scope.startIntro = function () {
          var intro = introJs();
          switch (activeView) {
            case "settings":
              intro.setOptions({
                showStepNumbers: false,
                steps: [
                  {
                    intro: "Settings!"
                  },
                  {
                    element: document.querySelector('#step1'),
                    intro: "This is a tooltip."
                  },
                  {
                    element: document.querySelector('#step2'),
                    intro: "This is the plain view"
                  },
                  {
                    element: document.querySelector('#step3'),
                    intro: "This is the fun and interesting view!"
                  }
                ]
              });
              break;
            case "channelGraph":
              intro.setOptions({
                showStepNumbers: false,
                steps: [
                  {
                    intro: "Channel graph!"
                  },
                  {
                    element: document.querySelector('#step1'),
                    intro: "This is a tooltip."
                  },
                  {
                    element: document.querySelector('#step2'),
                    intro: "This is the plain view"
                  },
                  {
                    element: document.querySelector('#step3'),
                    intro: "This is the fun and interesting view!"
                  }
                ]
              });
              break;
            case "signalStrength":
              intro.setOptions({
                showStepNumbers: false,
                steps: [
                  {
                    intro: "Signal strength!"
                  },
                  {
                    element: document.querySelector('#step1'),
                    intro: "This is a tooltip."
                  },
                  {
                    element: document.querySelector('#step2'),
                    intro: "This is the plain view"
                  },
                  {
                    element: document.querySelector('#step3'),
                    intro: "This is the fun and interesting view!"
                  }
                ]
              });
              break;
            case "timeGraph":
              intro.setOptions({
                showStepNumbers: false,
                steps: [
                  {
                    intro: "Time graph!"
                  },
                  {
                    element: document.querySelector('#step1'),
                    intro: "This is a tooltip."
                  },
                  {
                    element: document.querySelector('#step2'),
                    intro: "This is the plain view"
                  },
                  {
                    element: document.querySelector('#step3'),
                    intro: "This is the fun and interesting view!"
                  }
                ]
              });
              break;
            case "APTable":
              intro.setOptions({
                showStepNumbers: false,
                steps: [
                  {
                    intro: "Welcome to the AP Table view!"
                  },
                  {
                    element: document.querySelector('#step1'),
                    intro: "This is the table where you can view information "
                            + "about each in-range access point."
                  },
                  {
                    element: document.querySelector('#step2'),
                    intro: "By tapping on a table column label, you can "
                            + "sort the information by the specific label."
                  },
                  {
                    element: document.querySelector('#step3'),
                    intro: "Level represents the signal strength!"
                  },
                  {
                    element: document.querySelector('#step4'),
                    intro: "The filter button allows you to search for "
                            + "and select only certain access points to be "
                            + "displayed on the table.",
                    position: "right"
                  }
                ]
              });
              break;
            case "channelTable":
              intro.setOptions({
                showStepNumbers: false,
                steps: [
                  {
                    intro: "Channel table!"
                  },
                  {
                    element: document.querySelector('#step1'),
                    intro: "This is a tooltip."
                  },
                  {
                    element: document.querySelector('#step2'),
                    intro: "This is the plain view"
                  },
                  {
                    element: document.querySelector('#step3'),
                    intro: "This is the fun and interesting view!"
                  }
                ]
              });
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
      },
      function rejected() {
        console.log("navCtrl is unavailable because Cordova is not loaded.");
      }
    )
}])
