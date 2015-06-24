app.controller('tableCtrl', ['$scope', '$timeout', 'infoService', 'cordovaService',
  function($scope, $timeout, infoService, cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        $scope.accessPoints = {};
        $scope.predicate = 'level';
        $scope.reverse = false;

        $scope.order = function(predicate) {
          $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
          $scope.predicate = predicate;
        }

        var _update = function() {
          infoService.getInfo()
          .done(function(info) {
            $scope.accessPoints = info.available;
          })
          .fail(function() {
            $scope.accessPoints = {};
          });
          $timeout(_update, 1000);
        };

          _update();
        },
        function rejected() {
          console.log("tableCtrl is unavailable because Cordova is not loaded.")
        }
    );
}]);
