"use strict";

app.factory('timeGraphManager', ['accessPoints', 'globalSettings', 'setupService',
  function(accessPoints, globalSettings, setupService) {

  var service = {};

  setupService.ready.then(function() {

    var updateInterval = constants.updateIntervalNormal;

    var config = {
      timespan: 60
    };

    var datasets = {},
        isSelected = {},
        showAll = true,
        highlightedMacAddr = null;

    var numDataPoints;

    service.getSelectedDatasets = function() {
      var selectedDatasets = [];

      $.each(datasets, function(macAddr) {
        if (showAll || isSelected[macAddr]) {
          if (globalSettings.detectHidden() ||
              datasets[macAddr].SSID !== strings.hiddenSSID) {

            selectedDatasets.push(datasets[macAddr]);
          }
        }
      });

      return selectedDatasets;
    };

    service.getLegendData = function() {
      var legendData = [];

      $.each(datasets, function(macAddr) {
        if (showAll || isSelected[macAddr]) {
          if (globalSettings.detectHidden() ||
              datasets[macAddr].SSID !== strings.hiddenSSID) {

            legendData.push({
              SSID: datasets[macAddr].SSID,
              MAC: macAddr,
              color: datasets[macAddr].color,
            });
          }
        }
      });

      return legendData;
    };

    service.getDomain = function() {
      return [-config.timespan, 0];
    };

    service.getUpdateInterval = function() {
      return updateInterval;
    };

    service.toggleHighlight = function(macAddr) {
      if (datasets[macAddr]) {
        if (macAddr === highlightedMacAddr) {
          datasets[macAddr].highlight = false;
          highlightedMacAddr = null;

        } else {
          if (datasets[highlightedMacAddr]) {
            datasets[highlightedMacAddr].highlight = false;
          }

          datasets[macAddr].highlight = true;
          highlightedMacAddr = macAddr;
        }
      }
    };

    service.getHighlightedMacAddr = function() {
      return highlightedMacAddr;
    };

    service.getHighlightedSSID = function() {
      if (datasets[highlightedMacAddr]) {
        return datasets[highlightedMacAddr].SSID;
      } else {
        return null;
      }
    };

    function updateDatasets() {
      accessPoints.getAll().done(function(results) {
        var macAddrToDataPoint = {},
            legendUpdateNeeded = false;

        $.each(results, function(i, dataPoint) {
          macAddrToDataPoint[dataPoint.MAC] = dataPoint;
        });

        /* Update existing datasets */
        var correspondingDataPoint;

        $.each(datasets, function(macAddr) {
          var dataset = datasets[macAddr].dataset;

          correspondingDataPoint = macAddrToDataPoint[macAddr];

          /* Remove dummy end points (there to allow fill) */
          dataset.shift();
          dataset.pop();

          dataset.shift();

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
        });

        /* Build new datasets */
        var dataPoint, newDataset;

        $.each(results, function(i, dataPoint) {

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
              highlight: false,
              dataset: newDataset
            }

            legendUpdateNeeded = true;
          }

        });

        document.dispatchEvent(new Event(events.newTimeGraphData));

        if (legendUpdateNeeded) {
          document.dispatchEvent(new Event(events.newLegendData));
        }

      });
    };

    function init() {
      numDataPoints = (config.timespan / (updateInterval / 1000)) + 2;

      updateDatasets();
      setInterval(updateDatasets, updateInterval);

      document.addEventListener(events.newAccessPointSelection['timeGraph'],
                                updateSelection);
    };

    function updateSelection() {
      var selection = globalSettings.getAccessPointSelection('timeGraph');

      $.each(isSelected, function(macAddr) {
        isSelected[macAddr] = false;
      });

      $.each(selection.macAddrs, function(i, macAddr) {
        isSelected[macAddr] = true;
      });

      showAll = selection.showAll;

      document.dispatchEvent(new Event(events.newLegendData));
    };

    init();

  });

  return service;

}]);
