app.controller('navCtrl', ['$scope', '$state', '$timeout', 'cordovaService',
  function($scope, $state, $timeout, cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        $scope.showNav = function() {
          clearTimeout(navTimeout);
          var navBar = $('#bottomBar');
          navBar.css('bottom', '0px');
          navTimeout = setTimeout(function() {
            navBar.css('bottom', document.bottomBarBottom);
          }, NAV_SHOW_INTERVAL);
        };

        $scope.setActive = function(view) {
          var titleText;
          switch (view) {
            case "channelGraph":
              titleText = "Channel Graph";
              break;
            case "signalStrength":
              titleText = "Signal Strength";
              break;
            case "timeGraph":
              titleText = "Time Graph";
              break;
            case "APTable":
              titleText = "AP Table";
              break;
            case "channelTable":
              titleText = "Channel Table";
              break;
            case "settings":
              titleText = "Settings";
              break;
            default:
              titleText = "";
          }
          document.getElementById('greenTitle').innerHTML = titleText;
          var oldHighlightedImg = $('#' + activeView + "-img")[0],
              newHighlightedImg = $('#' + view + "-img")[0];

          oldHighlightedImg.src = oldHighlightedImg.src.replace("-selected", "");
          newHighlightedImg.src = newHighlightedImg.src.replace(".png", "-selected.png");

          activeView = view;
        };

        $scope.isActive = function(view) {
          return activeView === view;
        };

        $scope.usesFilterBtn = function() {
          return activeView === 'APTable' || activeView === 'timeGraph' || activeView === 'channelGraph';
        };

        $scope.swipeRight = function (view) {
          $state.go(view);
          $scope.setActive(view);
        };

        $scope.swipeLeft = function (view) {
          $state.go(view);
          $scope.setActive(view);
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

        var activeView = "settings",
            navTimeout = null,
            NAV_SHOW_INTERVAL = 2000;

        $scope.setActive('settings');
      },
      function rejected() {
        console.log("navCtrl is unavailable because Cordova is not loaded.");
      }
    )
}])
