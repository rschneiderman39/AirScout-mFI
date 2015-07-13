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
        $scope.event = function() {
          alert('Event');
        };

        var selectedBSSID = "";

        var plot = timeGraphDataService.getPlot();
        plot.streamTo($('#plot')[0], 1000);

        $scope.$on('$destroy', function() {
          plot.stop();
        });

        var getDuplicateSSIDs = function() {
          var found = {},
              isDuplicateSSID = {};
          for (var i = 0; i < $scope.legendData.length; ++i) {
            if (found[$scope.legendData[i].SSID]) {
              isDuplicateSSID[$scope.legendData[i].SSID] = true;
            } else {
              found[$scope.legendData[i].SSID] = true;
            }
          }
          return isDuplicateSSID;
        };

        var updateLegend = function(data) {
          $scope.$apply(function() {
            $scope.legendData = data;
            $scope.isDuplicateSSID = getDuplicateSSIDs();
          });
          timeGraphDataService.requestLegendData().done(updateLegend);
        };

        $scope.legendData = timeGraphDataService.getLegendData();
        timeGraphDataService.requestLegendData().done(updateLegend);
      },
      function rejected() {
        console.log('timeGraphCtrl is unavaiable because Cordova is not loaded.');
      }
    );
}]);
