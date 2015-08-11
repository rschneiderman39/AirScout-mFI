app.factory('timeGraphManager', ['accessPoints', 'globalSettings',
'setupService', function(accessPoints, globalSettings, setupService) {

  var service = {};

  setupService.ready.then(function() {

    var updateInterval = constants.updateIntervalNormal;

    var prefs = {
      highlightOpacity: 0.4
    };

    var isSelected = {},
        showAll = true,
        datasets = {},
        plot = undefined,
        highlightedMAC = undefined;

    service.getPlot = function() {
      return plot;
    };

    service.getLegendData = function() {
      return generateLegendData();
    };

    service.toggleAccessPointHighlight = function(MAC) {
      if (MAC === highlightedMAC) {
        unhighlightAccessPoint(MAC);
      } else {
        unhighlightAccessPoint(highlightedMAC);
        highlightAccessPoint(MAC);
      }
    };

    service.getHighlightedMAC = function() {
      return highlightedMAC;
    };

    service.getDelay = function() {
      return updateInterval;
    };

    var generateLegendData = function() {
      var legendData = [];
      for (var MAC in datasets) {
        if (datasets[MAC].inPlot) {
          legendData.push(
            {
              SSID: datasets[MAC].SSID,
              MAC: MAC,
              color: datasets[MAC].color,
            }
          );
        }
      }
      return legendData;
    };

    var highlightAccessPoint = function(MAC) {
      unselectAccessPoint(MAC);
      selectAccessPoint(MAC, { lineWidth: 6, strokeStyle: datasets[MAC].color, fillStyle: utils.toNewAlpha(datasets[MAC].color, prefs.highlightOpacity)});
      highlightedMAC = MAC;
    };

    var unhighlightAccessPoint = function(MAC) {
      unselectAccessPoint(MAC);
      selectAccessPoint(MAC);
      highlightedMAC = "";
    };

    var addAccessPoint = function(accessPoint) {
      if (! datasets[accessPoint.MAC]) {
        datasets[accessPoint.MAC] = {
          SSID: accessPoint.SSID,
          color: accessPoint.color,
          line: new TimeSeries({ resetBounds: false }),
          inPlot: false,
        };
      }
    };

    var removeAccessPoint = function(MAC) {
      if (datasets[MAC]) {
        unselectAccessPoint(MAC);
        delete datasets[MAC];
      }
    };

    var selectAccessPoint = function(MAC, options) {
      if (datasets[MAC]) {
        if (! options) {
          options = { lineWidth: 2, strokeStyle: datasets[MAC].color };
        }
        plot.addTimeSeries(datasets[MAC].line, options);
        datasets[MAC].inPlot = true;
      }
    };

    var unselectAccessPoint = function(MAC) {
      if (datasets[MAC]) {
        plot.removeTimeSeries(datasets[MAC].line);
        datasets[MAC].inPlot = false;
        if (MAC === highlightedMAC) {
          highlightedMAC = "";
        }
      }
    };

    var applyAccessPointSelection = function() {
      var selectionChanged = false;

      for (var MAC in datasets) {
        if (isSelected[MAC] || showAll) {
          if (! globalSettings.detectHidden() && datasets[MAC].SSID === "<hidden>") {
            unselectAccessPoint(MAC);
            selectionChanged = true;
          } else if (! datasets[MAC].inPlot) {
            selectAccessPoint(MAC);
            selectionChanged = true;
          }
        } else {
          if (datasets[MAC].inPlot) {
            unselectAccessPoint(MAC);
            selectionChanged = true;
          }
        }
      }

      if (selectionChanged) {
        document.dispatchEvent(new Event(events.newLegendData));
      }
    };

    var updateSelection = function() {
      var selection = globalSettings.getAccessPointSelection('timeGraph');

      isSelected = {};

      for (var i = 0; i < selection.macAddrs.length; ++i) {
        isSelected[selection.macAddrs[i]] = true;
      }

      showAll = selection.showAll;

      applyAccessPointSelection();
    };

    var updateDatasets = function() {
      var curTime = new Date().getTime(),
          MACtoAccessPoint = {};

      accessPoints.getAll().done(function(results) {
        for (var i = 0; i < results.length; ++i) {
          MACtoAccessPoint[results[i].MAC] = results[i];
        }

        // Update existing datasets
        for (var MAC in datasets) {
          var accessPoint = MACtoAccessPoint[MAC];
          if (accessPoint) {
            datasets[MAC].line.append(curTime, accessPoint.level);
          } else {
            datasets[MAC].line.append(curTime, constants.noSignal);
          }
        }

        // Discover new datasets
        for (var i = 0; i < results.length; ++i) {
          var accessPoint = results[i];
          if (! datasets[accessPoint.MAC]) {
            addAccessPoint(accessPoint);
            datasets[accessPoint.MAC].line.append(curTime, accessPoint.level);
          }
        }

      });
    };

    var update = function() {
      if (! globalSettings.updatesPaused()) {
        updateDatasets();
        applyAccessPointSelection();
      }
    };

    var init = function() {
      plot = new SmoothieChart(
        {
          minValue: constants.noSignal,
          maxValue: constants.maxSignal,
          millisPerPixel: 60,
          interpolation: 'linear',
          horizontalLines:
          [
            { value: -100, color: '#c0c0c0', lineWidth: 1 },
            { value: -90, color: '#c0c0c0', lineWidth: 1 },
            { value: -80, color: '#c0c0c0', lineWidth: 1 },
            { value: -70, color: '#c0c0c0', lineWidth: 1 },
            { value: -60, color: '#c0c0c0', lineWidth: 1 },
            { value: -50, color: '#c0c0c0', lineWidth: 1 },
            { value: -40, color: '#c0c0c0', lineWidth: 1 },
            { value: -30, color: '#c0c0c0', lineWidth: 1 }
          ],
          grid:
          {
            fillStyle: '#eeeeee',
            strokeStyle: 'rgba(0,0,0,0)',
            verticalSections: 7
          },
          labels:
          {
            fillStyle: '#000000',
            precision: 0,
            fontSize: 13
          }
        }
      );

      var selection = globalSettings.getAccessPointSelection('timeGraph');

      for (var i = 0; i < selection.macAddrs.length; ++i) {
        isSelected[selection.macAddrs[i]] = true;
      }

      showAll = selection.showAll;

      update();
      setInterval(update, updateInterval);

      document.addEventListener(events.newAccessPointSelection['timeGraph'], updateSelection);
    };

    init();

  });

  return service;

}]);
