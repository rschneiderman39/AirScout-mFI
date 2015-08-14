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
        var dataPoint, newDataset;

        for (var i = 0; i < results.length; ++i) {
          dataPoint = results[i];

          macAddrToDataPoint[dataPoint.MAC] = dataPoint;

          if (! datasets[dataPoint.MAC]) {
            newDataset = [];

            var t = -config.timespan;

            for (var j = 0; j < numDataPoints - 1; ++j) {
              newDataset.push({
                time: t,
                level: constants.noSignal
              });

              t += updateInterval / 1000;
            }

            newDataset.push({
              time: t,
              level: dataPoint.level
            });

            datasets[i] = {
              MAC: dataPoint.MAC,
              SSID: dataPoint.SSID,
              color: dataPoint.color,
              dataset: newDataset
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

      updateDatasets();
      setInterval(updateDatasets, updateInterval);
    };

    init();

  });

  return service;

}]);
