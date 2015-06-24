app.controller('tableCtrl', ['$scope', '$timeout', 'infoService',
                             'filterService', 'cordovaService',
  function($scope, $timeout, infoService, filterService, cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        $scope.selectedAPs = [];
        $scope.predicate = 'level';
        $scope.reverse = false;

        // Serves as both a switc
        $scope.order = function(predicate) {
          $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
          $scope.predicate = predicate;
        }

        var _accessPoints = [];
        var _selection = ['Orion2', 'NETGEAR85'];

        var _update = function() {
          infoService.getInfo()
          .done(function(info) {
            _accessPoints = info.available;
          })
          .fail(function() {
            _accessPoints = [];
          });
          $scope.selectedAPs = filterService.filterBySSID(_accessPoints, _selection);
          $timeout(_update, 1000);
        };

          $scope.$apply(_update());
        },
        function rejected() {
          console.log("tableCtrl is unavailable because Cordova is not loaded.")
        }
    );
}]);
