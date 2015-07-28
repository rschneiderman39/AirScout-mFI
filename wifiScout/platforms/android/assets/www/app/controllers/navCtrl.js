app.controller('navCtrl', ['$scope', '$state', 'nzTour', 'cordovaService',
  function($scope, $state, nzTour, cordovaService) {
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

          document.getElementById('view-title').innerHTML = titleText;

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

        var channelTableTour = {
          config: {
            mask: {
                visible: true, // Shows the element mask
                clickThrough: false, // Allows the user to interact with elements beneath the mask
                clickExit: true, // Exit the tour when the user clicks on the mask
                scrollThrough: true, // Allows the user to scroll while hovered over the mask
                color: 'rgba(0,0,0,.7)' // The mask color
            },
            container: 'body', // The container to mask
            scrollBox: 'body', // The container to scroll when searching for elements
            previousText: 'Previous',
            nextText: 'Next',
            finishText: 'Finish',
            animationDuration: 400, // Animation Duration for the box and mask
            dark: false // Dark mode (Works great with `mask.visible = false`)
          },      
          steps: [{   
              content: "The channel table view displays the number of access points on"
                    + " each channel in the 2.4Ghz and 5.0Ghz freqency ranges.",
            },
            {
              target: '#navLeft',
              content: "This represents the 2.4Ghz frequency range. The 2.4Ghz frequency"
                    + " has a greater range than a 5.0Ghz channel.",
            },
            {
              target: "#navRight",
              content: "This represents the 5.0Ghz frequency range. The 5.0Ghz range allows for"
                    + " 23 nonoverlapping channels while the 2.4Ghz range can only support 3."
                    + " Therefore, the 5.0Ghz frequency can support a larger number of devices"
                    + " with less interference than the 2.4Ghz frequency.",
            }]
        };

        var apTableTour = {
          config: {
            mask: {
                visible: true, // Shows the element mask
                clickThrough: false, // Allows the user to interact with elements beneath the mask
                clickExit: true, // Exit the tour when the user clicks on the mask
                scrollThrough: true, // Allows the user to scroll while hovered over the mask
                color: 'rgba(0,0,0,.7)' // The mask color
            },
            container: 'body', // The container to mask
            scrollBox: 'body', // The container to scroll when searching for elements
            previousText: 'Previous',
            nextText: 'Next',
            finishText: 'Finish',
            animationDuration: 400, // Animation Duration for the box and mask
            dark: false // Dark mode (Works great with `mask.visible = false`)
          },      
          steps: [{
              target: '#step1',
              content: "More commonly referred to as signal strength, the signal level of"
                    + " an access point is measured in dBm (decibel milliwatts). dBm is measured" 
                    + " on a logarithmic scale which means that every increase of about 3dBm is"
                    + " equivalent to doubling the actual power of the signal in question. The"
                    + " signal strength is expressed as a negative number because wireless networks" 
                    + " are not powerful enough to radiate enough energy to give out such a strong"
                    + " signal. A signal strength can theoretically become positive if the amount of"
                    + " emitted energy being collected at any point in time exceeds one milliwatt.",
            },
            {
              target: "#step2",
              content: "*****NEEDS TO BE FILLED IN*****",
            },
            {
              target: "#step3",
              content: "Wireless networks have three different security options: WEP, WPA,"
                + " and WPA2. WEP is the oldest security option and is considerably outdated - "
                + " it should only be used when no other option is available. WPA is a certification"
                + " that includes one protocol - TKIP. WPA2 is also a certification but it includes two"
                + " security protocols - TKIP and CCMP. WPA2-CCMP is considered to be the most secure"
                + " protocol available and should be chosed whenever it is available.",
            },
            {
              target: "#step4",
              content: "The filter button allows you to search for, select, or elimate certain"
                + " access points that are displayed on the table.",
            }]
        };

        var timeGraphTour = {
          config: {
            mask: {
                visible: true, // Shows the element mask
                clickThrough: false, // Allows the user to interact with elements beneath the mask
                clickExit: true, // Exit the tour when the user clicks on the mask
                scrollThrough: true, // Allows the user to scroll while hovered over the mask
                color: 'rgba(0,0,0,.7)' // The mask color
            },
            container: 'body', // The container to mask
            scrollBox: 'body', // The container to scroll when searching for elements
            previousText: 'Previous',
            nextText: 'Next',
            finishText: 'Finish',
            animationDuration: 400, // Animation Duration for the box and mask
            dark: false // Dark mode (Works great with `mask.visible = false`)
          },      
          steps: [{
              content: "This interactive graph displays the observed signal strength of"
                    + " each access point over time and is updated every half second.",
            },
            {
              target: "#step4",
              content: "The filter button allows you to search for, select, or elimate certain"
                    + " access points that are displayed on the graph.",
            }]
        };

        var signalStrengthTour = {
          config: {
            mask: {
                visible: true, // Shows the element mask
                clickThrough: false, // Allows the user to interact with elements beneath the mask
                clickExit: true, // Exit the tour when the user clicks on the mask
                scrollThrough: true, // Allows the user to scroll while hovered over the mask
                color: 'rgba(0,0,0,.7)' // The mask color
            },
            container: 'body', // The container to mask
            scrollBox: 'body', // The container to scroll when searching for elements
            previousText: 'Previous',
            nextText: 'Next',
            finishText: 'Finish',
            animationDuration:500, // Animation Duration for the box and mask
            dark: false // Dark mode (Works great with `mask.visible = false`)
          },      
          steps: [{
              content: "This page provides a live signal strength reading for a selected"
                    + " access point - it includes a maximum, minimum, and current reading" 
                    + " for any in range AP during the time the page is open.",
            },
            {
              target: ".minLevel",
              content: "This box holds the weakest observed signal strength for the"
                    + " selected access point.",
            },
            {
              target: ".maxLevel",
              content: "This box holds the strongest observed signal strength for the"
                    + " selected access point.",
            }]
        };

        var channelGraphTour = {
          config: {
            mask: {
                visible: true, // Shows the element mask
                clickThrough: false, // Allows the user to interact with elements beneath the mask
                clickExit: true, // Exit the tour when the user clicks on the mask
                scrollThrough: true, // Allows the user to scroll while hovered over the mask
                color: 'rgba(0,0,0,.7)' // The mask color
            },
            container: 'body', // The container to mask
            scrollBox: 'body', // The container to scroll when searching for elements
            previousText: 'Previous',
            nextText: 'Next',
            finishText: 'Finish',
            animationDuration: 400, // Animation Duration for the box and mask
            dark: false // Dark mode (Works great with `mask.visible = false`)
          },      
          steps: [{
              content: "This is the channel graph view.",
            }]
        };

        $scope.startTour = function () {
          switch (activeView) {
            case "channelTable":
              nzTour.start(channelTableTour);
            break;
            case "APTable":
              nzTour.start(apTableTour);
            break;
            case "timeGraph":
              nzTour.start(timeGraphTour);
            break;
            case "signalStrength":
              nzTour.start(signalStrengthTour);
            break;
            case "channelGraph":
              nzTour.start(channelGraphTour);
            break;
          }
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
}]);