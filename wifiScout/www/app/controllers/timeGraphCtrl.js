app.controller('timeGraphCtrl', ['$scope', 'timeGraphDataService', 'cordovaService',
  function($scope, timeGraphDataService, cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        $scope.legendData = undefined;

        var initLegend = function() {
          $scope.$apply(function() {
            $scope.legendData = timeGraphDataService.getLegendData();
          });
        };

        var plot = timeGraphDataService.getPlot();
        plot.streamTo($('#plot')[0], 1000);

        $scope.$on('$destroy', function() {
          plot.stop();
        });

        $('#legendModal').on('show.bs.modal', initLegend);

        var updateLegend = function(data) {
          $scope.$apply(function() {
            $scope.legendData = data;
          });
          timeGraphDataService.requestLegendData().done(updateLegend);
        };

        $scope.legendData = timeGraphDataService.getLegendData();
        console.log(JSON.stringify($scope.legendData));
        timeGraphDataService.requestLegendData().done(updateLegend);
      },
      function rejected() {
        console.log('timeGraphCtrl is unavaiable because Cordova is not loaded.');
      }
    );
}]);