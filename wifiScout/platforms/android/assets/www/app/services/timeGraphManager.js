"use strict";

app.factory('timeGraphManager', ['accessPoints', 'globalSettings', 'setupService',
  function(accessPoints, globalSettings, setupService) {

  var service = {};

  setupService.ready.then(function() {

    var updateInterval = 1000;

    var config = {
      timespan: 30
    };

    var datasets = {},
        isSelected = {},
        showAll = true;

    var numDataPoints;

    service.getSelectedDatasets = function() {
      var selectedDatasets = [];

      for (var macAddr in datasets) {
        if (showAll || isSelected[macAddr]) {
          if (globalSettings.detectHidden() ||
              datasets[macAddr].SSID !== strings.hiddenSSID) {
            selectedDatasets.push(datasets[macAddr]);
          }
        }
      }

      return selectedDatasets;
    };

    service.getDomain = function() {
      return [-config.timespan, 0];
    };

    service.getUpdateInterval = function() {
      return updateInterval;
    };

    var updateDatasets = function() {
      accessPoints.getAll().done(function(results) {
        var macAddrToDataPoint = {};

        for (var i = 0; i < results.length; ++i) {
          macAddrToDataPoint[results[i].MAC] = results[i];
        }

        /* Update existing datasets */
        var correspondingDataPoint;

        for (var macAddr in datasets) {
          var dataset = datasets[macAddr].dataset;

          correspondingDataPoint = macAddrToDataPoint[macAddr];

          /* Remove dummy end points (there to allow fill) */
          dataset.shift();
          dataset.shift();
          dataset.pop();

          if (correspondingDataPoint) {
            dataset.push({
              level: correspondingDataPoint.level
            });
          } else {
            dataset.push({
              level: constants.noSignal
            });
          }

          /* Add dummy end points (to allow fill)*/
          dataset.unshift({
            level: constants.noSignal
          });

          dataset.push({
            level: constants.noSignal
          });
        }

        /* Build new datasets */
        var dataPoint, newDataset;

        for (var i = 0; i < results.length; ++i) {
          dataPoint = results[i];

          if (! datasets[dataPoint.MAC]) {
            newDataset = [];

            for (var j = 0; j < numDataPoints - 1; ++j) {
              newDataset.push({
                level: constants.noSignal
              });
            }

            newDataset.push({
              level: dataPoint.level
            });

            /* Add dummy data points to allow fill */
            newDataset.unshift({
              level: constants.noSignal
            });

            newDataset.push({
              level: constants.noSignal
            });

            datasets[dataPoint.MAC] = {
              MAC: dataPoint.MAC,
              SSID: dataPoint.SSID,
              color: dataPoint.color,
              highlight: (i === 0 ? true : false),
              dataset: newDataset
            }
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
