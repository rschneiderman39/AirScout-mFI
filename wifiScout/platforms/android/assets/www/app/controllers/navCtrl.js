app.controller('navCtrl', ['$scope', '$state', 'cordovaService', function($scope, $state,
  cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        $scope.setActive = function(title, view) {
          var newViewLink = document.getElementById(view);
          $('a').removeClass("active_view");
          $(newViewLink).addClass("active_view");
          document.getElementById('greenTitle').innerHTML = title;

          var oldHighlightedImg = $('#' + activeView + " Img")[0],
              newHighlightedImg = $('#' + view + " Img")[0];

          console.log(oldHighlightedImg.src);
          console.log(newHighlightedImg.src);

          oldHighlightedImg.src = oldHighlightedImg.src.replace("-selected", "");
          newHighlightedImg.src = newHighlightedImg.src.replace(".png", "-selected.png");

          activeView = view;
        };

        $scope.isActive = function(view) {
          return activeView === view;
        };

        $scope.usesFilterBtn = function() {
          return activeView === 'apTable' || activeView === 'timeGraph' || activeView === 'channelGraph';
        };

        $scope.swipeRight = function (view) {
          console.log("swiping right");
          console.log(view);
          $state.go(view);
          $scope.setActive(view);
        }

        $scope.swipeLeft = function (view) {
          console.log("swiping left");
          $state.go(view);
          $scope.setActive(view);
        }

        var activeView = "Settings";

        $scope.setActive('Settings');
      },
      function rejected() {
        console.log("navCtrl is unavailable because Cordova is not loaded.");
      }
    )
  }])
