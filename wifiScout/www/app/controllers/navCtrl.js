app.controller('navCtrl', ['$scope', '$state', 'cordovaService', function($scope, $state,
  cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        $scope.setActive = function(view) {
          var newViewLink = document.getElementById(view);
          $('a').removeClass("active_view");
          $(newViewLink).addClass("active_view");

          var titleText;
          switch (view) {
            case "channelsGraph":
              titleText = "Channels Graph";
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
          console.log("swiping right");
          $state.go(view);
          $scope.setActive(view);
        }

        $scope.swipeLeft = function (view) {
          console.log("swiping left");
          $state.go(view);
          $scope.setActive(view);
        }

        var activeView = "settings";

        $scope.setActive('settings');
      },
      function rejected() {
        console.log("navCtrl is unavailable because Cordova is not loaded.");
      }
    )
  }])
