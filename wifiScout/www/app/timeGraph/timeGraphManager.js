"use strict";

app.factory('timeGraphManager', ['$rootScope', 'globals', 'accessPoints',
'globalSettings', 'setupSequence', function($rootScope, globals, accessPoints,
globalSettings, setupSequence) {

  var service = {};

  setupSequence.done.then(function() {

    var updateInterval = globals.updateIntervals.timeGraph;

    var config = {
      timespan: 60
    };

    var datasets = {},
        highlightedMac = null;

    var numDataPoints;

    init();

    function init() {
      service.getSelectedDatasets = function() {
        var selectedDatasets = [];

        $.each(datasets, function(mac, dataset) {
          if (apSelection().contains(mac)) {
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
          if (apSelection().contains(mac)) {
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

      numDataPoints = (config.timespan / (updateInterval / 1000)) + 2;

      $rootScope.$on(globals.events.newSelection, function() {
        if (! apSelection().contains(highlightedMac)) {
          if (datasets[highlightedMac]) {
            datasets[highlightedMac].highlight = false;
          }

          highlightedMac = null;
        }

        $rootScope.$broadcast(globals.events.newLegendData);
      });

      updateDatasets();

      setInterval(function() {
        if (! globalSettings.updatesPaused()) {
          updateDatasets();
        }
      }, updateInterval);

      $(document).on('pause', clearDatasets);

      function clearDatasets() {
        datasets = {};

        $rootScope.$broadcast(globals.events.newTimeGraphData);
        $rootScope.$broadcast(globals.events.newLegendData);
      };

    };

    function apSelection() {
      return globalSettings.accessPointSelection();
    };

    function updateDatasets() {
      accessPoints.getAll().then(function(results) {
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
            data.push({ level: globals.constants.signalFloor });
          }

          /* Add dummy end points (to allow fill)*/
          data.unshift({ level: globals.constants.signalFloor });

          data.push({ level: globals.constants.signalFloor });
        });

        /* Build new datasets */
        $.each(results, function(i, ap) {
          if (! datasets[ap.mac]) {
            datasets[ap.mac] = new Dataset(ap);
            legendUpdateNeeded = true;
          }
        });

        $rootScope.$broadcast(globals.events.newTimeGraphData);

        if (legendUpdateNeeded) {
          $rootScope.$broadcast(globals.events.newLegendData);
        }

      });
    };

    function Dataset(ap) {
      var data = [];

      for (var j = 0; j < numDataPoints - 1; ++j) {
        data.push({ level: globals.constants.signalFloor });
      }

      data.push({ level: ap.level });

      /* Add dummy data points to allow fill */
      data.unshift({ level: globals.constants.signalFloor });

      data.push({ level: globals.constants.signalFloor });

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

  });

  return service;

}]);
