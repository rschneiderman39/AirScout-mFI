app.controller('timeGraphCtrl', ['$scope', 'timeGraphDataService', 'cordovaService',
  function($scope, timeGraphDataService, cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        $scope.legendData = undefined;
        $scope.isDuplicateSSID = {};
        $scope.toggleSelected = function(BSSID) {
          if (typeof BSSID === 'string') {
            if (BSSID === selectedBSSID) {
              selectedBSSID = "";
            } else {
              selectedBSSID = BSSID;
            }
            timeGraphDataService.toggleAPHighlight(BSSID);
          }
        };
        $scope.isSelected = function(BSSID) {
          return BSSID === timeGraphDataService.getHighlightedBSSID();
        };

        var selectedBSSID = "";

        var updateDuplicateSSIDs = function() {
          var found = {},
              newDuplicates = {};
          for (var i = 0; i < $scope.legendData.length; ++i) {
            if (found[$scope.legendData[i].SSID]) {
              newDuplicates[$scope.legendData[i].SSID] = true;
            } else {
              found[$scope.legendData[i].SSID] = true;
            }
          }
          $scope.isDuplicateSSID = newDuplicates;
        };

        var updateLegend = function(data) {
          $scope.$apply(function() {
            $scope.legendData = data;
            updateDuplicateSSIDs();
          });
          timeGraphDataService.requestLegendData().done(updateLegend);
        };

        var plot = timeGraphDataService.getPlot();
        plot.streamTo($('#plot')[0], 1000);

        $scope.$on('$destroy', function() {
          plot.stop();
        });

        $scope.legendData = timeGraphDataService.getLegendData();
        updateDuplicateSSIDs();
        timeGraphDataService.requestLegendData().done(updateLegend);
      },
      function rejected() {
        console.log('timeGraphCtrl is unavaiable because Cordova is not loaded.');
      }
    );
}]);
