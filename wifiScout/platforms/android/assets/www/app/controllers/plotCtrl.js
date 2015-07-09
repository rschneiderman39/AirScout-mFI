app.controller('plotCtrl', ['$scope', 'plotDataService', 'cordovaService',
  function($scope, plotDataService, cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        $scope.legendData = undefined;

        var plot = plotDataService.getPlot();
        plot.streamTo($('#plot')[0], 1000);

        var _initLegend = function() {
          $scope.$apply(function() {
            $scope.legendData = plotDataService.getLegendData();
          });
        };

        $('#legendModal').on('show.bs.modal', _initLegend);

        $scope.$on('$destroy', function() {
          plot.stop();
        });
      },
      function rejected() {
        console.log('plotCtrl is unavaiable because Cordova is not loaded.');
      }
    );
}]);
