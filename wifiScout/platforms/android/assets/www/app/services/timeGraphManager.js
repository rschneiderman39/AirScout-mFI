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
        highlightedMac = null;

    var numDataPoints;

    service.getSelectedDatasets = function() {
      var selectedDatasets = [];

      $.each(datasets, function(mac, dataset) {
        if (mySelection().isSelected(mac)) {
          if (globalSettings.detectHidden() || ! dataset.hidden) {
            selectedDatasets.push(dataset);
          }
        }
      });

      return selectedDatasets;
    };

    service.getLegendData = function() {
      var legendData = [];

      $.each(datasets, function(mac, dataset) {
        if (mySelection().isSelected(mac)) {
          if (globalSettings.detectHidden() || ! dataset.hidden) {
            legendData.push(new LegendItem(dataset));
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

    service.toggleHighlight = function(mac) {
      if (datasets[mac]) {
        if (mac === highlightedMac) {
          datasets[mac].highlight = false;
          highlightedMac = null;

        } else {
          if (datasets[highlightedMac]) {
            datasets[highlightedMac].highlight = false;
          }

          datasets[mac].highlight = true;
          highlightedMac = mac;
        }
      }
    };

    service.getHighlightedMac = function() {
      return highlightedMac;
    };

    service.getHighlightedSsid = function() {
      if (datasets[highlightedMac]) {
        return datasets[highlightedMac].ssid;
      } else {
        return null;
      }
    };

    function init() {
      numDataPoints = (config.timespan / (updateInterval / 1000)) + 2;

      document.addEventListener(events.newSelection, function() {
        if (! mySelection().isSelected(highlightedMac)) {
          if (datasets[highlightedMac]) {
            datasets[highlightedMac].highlight = false;
          }

          highlightedMac = null;
        }

        document.dispatchEvent(new Event(events.newLegendData));
      });

      updateDatasets();
      setInterval(updateDatasets, updateInterval);
    };

    function mySelection() {
      return globalSettings.getAccessPointSelection('timeGraph');
    };

    function updateDatasets() {
      accessPoints.getAll().done(function(results) {
        var macToAccessPoint = {},
            legendUpdateNeeded = false;

        $.each(results, function(i, ap) {
          macToAccessPoint[ap.mac] = ap;
        });

        /* Update existing datasets */
        var correspondingAccessPoint;

        $.each(datasets, function(mac) {
          var data = datasets[mac].data;

          correspondingAccessPoint = macToAccessPoint[mac];

          /* Remove dummy end points (there to allow fill) */
          data.shift();
          data.pop();

          data.shift();

          if (correspondingAccessPoint) {
            data.push({ level: correspondingAccessPoint.level });
          } else {
            data.push({ level: constants.noSignal });
          }

          /* Add dummy end points (to allow fill)*/
          data.unshift({ level: constants.noSignal });

          data.push({ level: constants.noSignal });
        });

        /* Build new datasets */
        $.each(results, function(i, ap) {
          if (! datasets[ap.mac]) {
            datasets[ap.mac] = new Dataset(ap);
            legendUpdateNeeded = true;
          }
        });

        document.dispatchEvent(new Event(events.newTimeGraphData));

        if (legendUpdateNeeded) {
          document.dispatchEvent(new Event(events.newLegendData));
        }

      });
    };

    function Dataset(ap) {
      var data = [];

      for (var j = 0; j < numDataPoints - 1; ++j) {
        data.push({ level: constants.noSignal });
      }

      data.push({ level: ap.level });

      /* Add dummy data points to allow fill */
      data.unshift({ level: constants.noSignal });

      data.push({ level: constants.noSignal });

      this.ssid = ap.ssid;
      this.hidden = ap.hidden;
      this.mac = ap.mac;
      this.color = ap.color;
      this.highlight = false;
      this.data = data;

      return this;
    };

    function LegendItem(dataset) {
      this.ssid = dataset.ssid;
      this.mac = dataset.mac;
      this.color = dataset.color;

      return this;
    };

    init();

  });

  return service;

}]);
