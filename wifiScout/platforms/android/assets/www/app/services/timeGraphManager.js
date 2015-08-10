app.factory('timeGraphManager', ['accessPoints', 'globalSettings',
'setupService', function(accessPoints, globalSettings, setupService) {

  var service = {};

  setupService.ready.then(function() {

    var prefs = {
      highlightOpacity: 0.4
    };

    var isSelected = {},
        showAll = true,
        datasets = {},
        plot = undefined,
        highlightedBSSID = undefined;

    service.getPlot = function() {
      return plot;
    };

    service.getLegendData = function() {
      return generateLegendData();
    };

    service.toggleAccessPointHighlight = function(BSSID) {
      if (BSSID === highlightedBSSID) {
        unhighlightAccessPoint(BSSID);
      } else {
        unhighlightAccessPoint(highlightedBSSID);
        highlightAccessPoint(BSSID);
      }
    };

    service.getHighlightedBSSID = function(BSSID) {
      return highlightedBSSID;
    };

    service.getDelay = function() {
      return accessPoints.getUpdateInterval();
    }

    var generateLegendData = function() {
      var legendData = [];
      for (var BSSID in datasets) {
        if (datasets[BSSID].inPlot) {
          legendData.push(
            {
              SSID: datasets[BSSID].SSID,
              BSSID: BSSID,
              color: datasets[BSSID].color,
            }
          );
        }
      }
      return legendData;
    };

    var highlightAccessPoint = function(BSSID) {
      unselectAccessPoint(BSSID);
      selectAccessPoint(BSSID, { lineWidth: 6, strokeStyle: datasets[BSSID].color, fillStyle: utils.toNewAlpha(datasets[BSSID].color, prefs.highlightOpacity)});
      highlightedBSSID = BSSID;
    };

    var unhighlightAccessPoint = function(BSSID) {
      unselectAccessPoint(BSSID);
      selectAccessPoint(BSSID);
      highlightedBSSID = "";
    };

    var addAccessPoint = function(accessPoint) {
      if (! datasets[accessPoint.BSSID]) {
        datasets[accessPoint.BSSID] = {
          SSID: accessPoint.SSID,
          color: accessPoint.color,
          line: new TimeSeries({ resetBounds: false }),
          inPlot: false,
        };
      }
    };

    var removeAccessPoint = function(BSSID) {
      if (datasets[BSSID]) {
        unselectAccessPoint(BSSID);
        delete datasets[BSSID];
      }
    };

    var selectAccessPoint = function(BSSID, options) {
      if (datasets[BSSID]) {
        if (! options) {
          options = { lineWidth: 2, strokeStyle: datasets[BSSID].color };
        }
        plot.addTimeSeries(datasets[BSSID].line, options);
        datasets[BSSID].inPlot = true;
      }
    };

    var unselectAccessPoint = function(BSSID) {
      if (datasets[BSSID]) {
        plot.removeTimeSeries(datasets[BSSID].line);
        datasets[BSSID].inPlot = false;
        if (BSSID === highlightedBSSID) {
          highlightedBSSID = "";
        }
      }
    };

    var applyAccessPointSelection = function() {
      var selectionChanged = false;

      for (var BSSID in datasets) {
        if (isSelected[BSSID] || showAll) {
          if (! globalSettings.detectHidden() && datasets[BSSID].SSID === "<hidden>") {
            unselectAccessPoint(BSSID);
            selectionChanged = true;
          } else if (! datasets[BSSID].inPlot) {
            selectAccessPoint(BSSID);
            selectionChanged = true;
          }
        } else {
          if (datasets[BSSID].inPlot) {
            unselectAccessPoint(BSSID);
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

      for (var i = 0; i < selection.selectedBSSIDs.length; ++i) {
        isSelected[selection.selectedBSSIDs[i]] = true;
      }

      showAll = selection.showAll;

      applyAccessPointSelection();
    };

    var updateDatasets = function() {
      var curTime = new Date().getTime(),
          allAccessPoints = accessPoints.getAll(),
          BSSIDtoAccessPoint = {};

      for (var i = 0; i < allAccessPoints.length; ++i) {
        BSSIDtoAccessPoint[allAccessPoints[i].BSSID] = allAccessPoints[i];
      }

      // Update existing datasets
      for (var BSSID in datasets) {
        var accessPoint = BSSIDtoAccessPoint[BSSID];
        if (accessPoint) {
          datasets[BSSID].line.append(curTime, accessPoint.level);
        } else {
          datasets[BSSID].line.append(curTime, constants.noSignal);
        }
      }

      // Discover new datasets
      for (var i = 0; i < allAccessPoints.length; ++i) {
        var accessPoint = allAccessPoints[i];
        if (! datasets[accessPoint.BSSID]) {
          addAccessPoint(accessPoint);
          datasets[accessPoint.BSSID].line.append(curTime, accessPoint.level);
        }
      }
    };

    var update = function() {
      if (! globalSettings.updatesPaused()) {
        console.log(accessPoints.count());
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

      for (var i = 0; i < selection.selectedBSSIDs.length; ++i) {
        isSelected[selection.selectedBSSIDs[i]] = true;
      }

      showAll = selection.showAll;

      document.addEventListener(events.newAccessPointData, update);
      document.addEventListener(events.newAccessPointSelection['timeGraph'], updateSelection);
    };

    init();

  });

  return service;

}]);
