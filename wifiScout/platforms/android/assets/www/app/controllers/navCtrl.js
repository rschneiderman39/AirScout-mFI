app.controller('navCtrl', ['$scope', '$location', 'cordovaService',
  function($scope, $location, cordovaService) {
    cordovaService.ready.then(
      function resolved() {
      	console.log("IN NAV CONTROLLER");
        $scope.select = function(id) {
          var old_selected = $('#' + _selected)[0],
              new_selected = $('#' + id)[0];

          console.log(old_selected.src);

          old_selected.src = old_selected.src.replace("-selected", "");
          new_selected.src = new_selected.src.replace(".png", "-selected.png");

          _selected = id;
        }

        $scope.pageLeft = function(view) {
  			 console.log("HEY SWIPING LEFT");
          $location.path(view);
        }

        var _selected = 'settings-img';
      },
      function rejected() {
        console.log("navCtrl is unavailable because Cordova is not loaded.");
      }
    );
}]);
