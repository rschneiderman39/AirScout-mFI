app.controller('settingsCtrl', ['$scope', '$location', 'cordovaService', function($scope, $location,
  cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        console.log("IN SETTINGS CTRL!");
        $scope.swipeRight = function(view) {
          console.log("swiping right");
          $location.path(view);

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
          return _activeView === 'Table' || _activeView === 'Plot';
        };

        var _activeView = "Settings";

        $scope.setActive('Settings');
      },
      function rejected() {
        console.log("settingsCtrl is unavailable because Cordova is not loaded.");
      }
    )
  }
]);