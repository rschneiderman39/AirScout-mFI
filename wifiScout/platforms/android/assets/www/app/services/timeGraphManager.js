app.factory('timeGraphManager', ['accessPoints', 'setupService',
  function(accessPoints, setupService) {

  var service = {};

  setupService.ready.then(function() {

    var updateInterval = constants.updateIntervalNormal;

    var config = {
      timespan: 60
    };

    var datasets = {},
        isSelected = {},
        showAll = true;

    var numDataPoints,
        timeData;

    service.getSelectedDatasets = function() {
        var selectedDatasets = [];

        for (var macAddr in datasets) {
          if (showAll || isSelected[macAddr]) {
            selectedDatasets.push(datasets[macAddr]);
          }
        }

        return selectedDatasets;
    };

    service.getDomain = function() {
      return [-config.timespan, 0];
    };

    var updateDatasets = function() {
      accessPoints.getAll().done(function(results) {
        var macAddrToDataPoint = {};

        /* Build new datasets */
        var dataPoint, newLevelData;

        for (var i = 0; i < results.length; ++i) {
          dataPoint = results[i];

          macAddrToDataPoint[dataPoint.MAC] = dataPoint;

          if (! datasets[dataPoint.MAC]) {
            newLevelData = [];

            for (var j = 0; j < numDataPoints - 1; ++j) {
              newLevelData.push(constants.noSignal);
            }

            newLevelData.push(dataPoint.level);

            datasets[i] = {
              MAC: dataPoint.MAC,
              SSID: dataPoint.SSID,
              color: dataPoint.color,
              times: utils.deepCopy(timeData),
              levels: newLevelData
            }
          }
        }

        /* Update existing datasets */
        var correspondingDataPoint;

        for (var macAddr in datasets) {
          correspondingDataPoint = macAddrToDataPoint[macAddr];

          if (correspondingDataPoint) {
            datasets[macAddr].levels.unshift();
            datasets[macAddr].levels.push(correspondingDataPoint.level);
          } else {
            datasets[macAddr].levels.unshift();
            datasets[macAddr].levels.push(constants.noSignal);
          }
        }

        document.dispatchEvent(new Event(events.newTimeGraphData));
      });
    };

    var init = function() {
      numDataPoints = (config.timespan / (updateInterval / 1000)) + 2;

      timeData = [];

      var t = - config.timespan;

      for (var i = 0; i < numDataPoints; ++i) {
        timeData.push(t);
        t += updateInterval / 1000;
      }

      updateDatasets();
      setInterval(updateDatasets, updateInterval);
    };

    init();

  });

  return service;

}]);
