app.controller('navCtrl', ['$scope', 'cordovaService', function($scope,
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
        }

        var _activeView = "Settings";

        $scope.setActive('Settings');
      },
      function rejected() {
        console.log("navCtrl is unavailable because Cordova is not loaded.");
      }
    )
  }])