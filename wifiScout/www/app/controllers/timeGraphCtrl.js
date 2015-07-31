app.controller('timeGraphCtrl', ['$scope', 'timeGraphData',
'setupService', function($scope, timeGraphData, setupService) {

  setupService.ready.then(function() {
    $scope.strings = globals.strings;
    $scope.legendData = undefined;
    $scope.isDuplicateSSID = {};

    $scope.toggleSelected = function(BSSID) {
      if (typeof BSSID === 'string') {
        if (BSSID === selectedBSSID) {
          selectedBSSID = "";
        } else {
          selectedBSSID = BSSID;
        }
        timeGraphData.toggleAPHighlight(BSSID);
      }
    };

    $scope.isSelected = function(BSSID) {
      return BSSID === timeGraphData.getHighlightedBSSID();
    };

    $scope.sortSSID = globals.utils.customSSIDSort;

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
      timeGraphData.awaitLegendData().done(updateLegend);
    };

    var prepView = function() {
      document.getElementById('plot').height = globals.format.window.height * 0.75;
      document.getElementById('plot').width = globals.format.window.width * 0.69;
    };

    var init = function() {
      prepView();

      var plot = timeGraphData.getPlot();
      plot.streamTo($('#plot')[0], 1000);

      $scope.$on('$destroy', function() {
        plot.stop();
      });

      $scope.legendData = timeGraphData.getLegendData();
      updateDuplicateSSIDs();
      timeGraphData.awaitLegendData().done(updateLegend);
    };

    init();
  });

}]);
