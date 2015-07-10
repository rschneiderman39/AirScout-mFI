app.controller('navCtrl', ['$scope', '$state', 'cordovaService', function($scope, $state,
  cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        $scope.setActive = function(view) {
          var newViewLink = document.getElementById(view);
          $('a').removeClass("active_view");
          $(newViewLink).addClass("active_view");
          document.getElementById('greenTitle').innerHTML = view;

          var oldHighlightedImg = $('#' + _activeView + " Img")[0],
              newHighlightedImg = $('#' + view + " Img")[0];

          oldHighlightedImg.src = oldHighlightedImg.src.replace("-selected", "");
          newHighlightedImg.src = newHighlightedImg.src.replace(".png", "-selected.png");

          _activeView = view;
        };

        $scope.isActive = function(view) {
          return _activeView === view;
        };

        $scope.usesFilterBtn = function() {
          return _activeView === 'AP Table' || _activeView === 'Time Graph';
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

        var _activeView = "Settings";

        $scope.setActive('Settings');
      },
      function rejected() {
        console.log("navCtrl is unavailable because Cordova is not loaded.");
      }
    )
  }])
