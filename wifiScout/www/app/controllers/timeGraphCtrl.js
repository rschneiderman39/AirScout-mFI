app.controller('timeGraphCtrl', ['$scope', '$timeout', 'timeGraphManager',
'setupService', function($scope, $timeout, timeGraphManager, setupService) {

  setupService.ready.then(function() {

    var selectedBSSID = "";

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
        timeGraphManager.toggleAccessPointHighlight(BSSID);
      }
    };

    $scope.isSelected = function(BSSID) {
      return BSSID === timeGraphManager.getHighlightedBSSID();
    };

    $scope.sortSSID = utils.customSSIDSort;

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
        $scope.legendData = timeGraphManager.getLegendData();

        updateDuplicateSSIDs();
      });
    };

    var prepView = function() {
      document.getElementById('plot').height = $(window).height() * 0.75;
      document.getElementById('plot').width = $(window).width() * 0.69;
    };

    var init = function() {
      prepView();

      var plot = timeGraphManager.getPlot();
      plot.streamTo($('#plot')[0], timeGraphManager.getDelay());

      $scope.$on('$destroy', function() {
        plot.stop();
      });

      $scope.legendData = timeGraphManager.getLegendData();
      updateDuplicateSSIDs();

      document.addEventListener(events.newLegendData, updateLegend);
    };

    init();
  });

}]);
