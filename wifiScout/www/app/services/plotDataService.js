app.factory('plotDataService', ['APService', 'filterSettingsService',
  'APSelectorService', function(APService, filterSettingsService,
  APSelectorService) {
    var service = {},
        legendDataPromise = $.Deferred();

    service.getPlot = function() {
      return plot;
    };
    service.getLegendData = function() {
      return generateLegendData();
    };
    service.requestLegendData = function() {
      return legendDataPromise;
    };

    var UPDATE_INTERVAL = 1000,
        isSelected = {},
        showAll = true,
        datasets = {},
        plot;

    var generateLegendData = function() {
      var legendData = [];
      for (var BSSID in datasets) {
        if (datasets[BSSID].inPlot) {
          legendData.push(
            {
              SSID: datasets[BSSID].SSID,
              BSSID: BSSID,
              color: datasets[BSSID].color,
              curLevel: datasets[BSSID].curLevel
            }
          );
        }
      }
      return legendData;
    };

    var pushLegendData = function() {
      var request = legendDataPromise;
      legendDataPromise = $.Deferred();
      request.resolve(generateLegendData());
    };

    var getRandomColor = function() {
      var r = (Math.floor(Math.random() * 256)).toString(10),
          g = (Math.floor(Math.random() * 256)).toString(10),
          b = (Math.floor(Math.random() * 256)).toString(10);

      return 'rgba(' + r + ',' + g + ',' + b + ',' + '1)';
    };

    var addAP = function(APData) {
      if (! datasets[APData.BSSID]) {
        datasets[APData.BSSID] = {
          SSID: APData.SSID,
          color: getRandomColor(),
          line: new TimeSeries({ resetBounds: false }),
          inPlot: false,
          curLevel: APData.level
        };
      }
    };

    var removeAP = function(BSSID) {
      unselectAP(BSSID);
      delete datasets[BSSID];
    };

    var selectAP = function(BSSID) {
      var options = { lineWidth: 2, strokeStyle: datasets[BSSID].color };
      plot.addTimeSeries(datasets[BSSID].line, options);
      datasets[BSSID].inPlot = true;
    };

    var unselectAP = function(BSSID) {
      plot.removeTimeSeries(datasets[BSSID].line);
      datasets[BSSID].inPlot = false;
    };

    var applyAPSelection = function() {
      var selectionChanged = false;

      for (var BSSID in datasets) {
        if (isSelected[BSSID] || showAll) {
          if (! datasets[BSSID].inPlot) {
            selectAP(BSSID);
            selectionChanged = true;
          }
        } else {
          if (datasets[BSSID].inPlot) {
            unselectAP(BSSID);
            selectionChanged = true;
          }
        }
      }

      if (selectionChanged) {
        pushLegendData();
      }
    };

    var onFilterSettingsChange = function(settings) {
      isSelected = {};
      for (var i = 0; i < settings.selectedBSSIDs.length; ++i) {
        isSelected[settings.selectedBSSIDs[i]] = true;
      }

      showAll = settings.showAll;
      applyAPSelection();
      filterSettingsService.requestSettings('plot').done(onFilterSettingsChange);
    };

    var updateDatasets = function() {
      var curTime = new Date().getTime(),
          APData = APService.getNamedAPData(),
          APDataMap = {};

      for (var i = 0; i < APData.length; ++i) {
        APDataMap[APData[i].BSSID] = APData[i];
      }

      // Update existing datasets
      for (var BSSID in datasets) {
        var AP = APDataMap[BSSID];
        if (AP) {
          datasets[BSSID].line.append(curTime, AP.level);
          datasets[BSSID].curLevel = AP.level;
        } else {
          datasets[BSSID].line.append(curTime, -100);
          datasets[BSSID].curLevel = -100;
        }
      }

      // Discover new datasets
      for (var i = 0; i < APData.length; ++i) {
        var AP = APData[i];
        if (! datasets[AP.BSSID]) {
          addAP(AP);
          datasets[AP.BSSID].line.append(curTime, AP.level);
          foundNewAPs = true;
        }
      }
    };

    var update = function() {
      updateDatasets();
      applyAPSelection();
    };

    /* INIT */

    plot = new SmoothieChart(
      {
        minValue: -100,
        maxValue: -30,
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

    var settings = filterSettingsService.getSettings('plot');
    for (var i = 0; i < settings.selectedBSSIDs.length; ++i) {
      isSelected[settings.selectedBSSIDs[i]] = true;
    }
    showAll = settings.showAll;
    filterSettingsService.requestSettings('plot').done(onFilterSettingsChange);

    setInterval(update, UPDATE_INTERVAL);

    return service;
}]);
