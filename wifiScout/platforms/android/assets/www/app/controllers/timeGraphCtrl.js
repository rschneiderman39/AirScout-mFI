app.controller('timeGraphCtrl', ['$scope', '$timeout', 'timeGraphData',
'setupService', function($scope, $timeout, timeGraphData, setupService) {

  setupService.ready.then(function() {
    $scope.strings = strings;
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

    $scope.sortSSID = utils.customSSIDSort;

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

    var updateLegend = function() {
      $timeout(function() {
        $scope.legendData = timeGraphData.getLegendData();

        updateDuplicateSSIDs();
      });
    };

    var prepView = function() {
      document.getElementById('plot').height = dimensions.window.height * 0.75;
      document.getElementById('plot').width = dimensions.window.width * 0.69;
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

      document.addEventListener(events.newLegendData, updateLegend);
    };

    init();
  });

}]);
