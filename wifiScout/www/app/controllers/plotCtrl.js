app.controller('plotCtrl', ['$scope', 'plotDataService', 'cordovaService',
  function($scope, plotDataService, cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        $scope.legendData = undefined;

        var initLegend = function() {
          $scope.$apply(function() {
            $scope.legendData = plotDataService.getLegendData();
          });
        };

        var plot = plotDataService.getPlot();
        plot.streamTo($('#plot')[0], 1000);

        $scope.$on('$destroy', function() {
          plot.stop();
        });

        $('#legendModal').on('show.bs.modal', initLegend);

        var updateLegend = function(data) {
          $scope.$apply(function() {
            $scope.legendData = data;
          });
          plotDataService.requestLegendData().done(updateLegend);
        };

        $scope.legendData = plotDataService.getLegendData();
        console.log(JSON.stringify($scope.legendData));
        plotDataService.requestLegendData().done(updateLegend);
      },
      function rejected() {
        console.log('plotCtrl is unavaiable because Cordova is not loaded.');
      }
    );
}]);
