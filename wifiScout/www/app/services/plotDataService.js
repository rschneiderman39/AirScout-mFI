app.factory('plotDataService', ['APService', 'filterSettingsService',
  'APSelectorService', function(APService, filterSettingsService,
  APSelectorService) {
    var service = {};

    service.getPlot = function() {
      return _plot;
    };
    service.getLegendData = function() {
      var legendData = [];
      for (var BSSID in _datasets) {
        if (_datasets[BSSID].inPlot) {
          legendData.push(
            {
              SSID: _datasets[BSSID].SSID,
              BSSID: BSSID,
              color: _datasets[BSSID].color,
            }
          );
        }
      }
      return legendData;
    };

    var _UPDATE_INTERVAL = 1000,
        _isSelected = {},
        _showAll = true,
        _datasets = {},
        _plot;


    var _getRandomColor = function() {
      var r = (Math.floor(Math.random() * 256)).toString(10),
          g = (Math.floor(Math.random() * 256)).toString(10),
          b = (Math.floor(Math.random() * 256)).toString(10);

      return 'rgba(' + r + ',' + g + ',' + b + ',' + '1)';
    };

    var _addAP = function(APData) {
      if (! _datasets[APData.BSSID]) {
        _datasets[APData.BSSID] = {
          SSID: APData.SSID,
          color: _getRandomColor(),
          line: new TimeSeries({ resetBounds: false }),
          inPlot: false
        };
      }
    };

    var _removeAP = function(BSSID) {
      _unselectAP(BSSID);
      delete _datasets[BSSID];
    };

    var _selectAP = function(BSSID) {
      if (! _datasets[BSSID].inPlot) {
        var options = { lineWidth: 2, strokeStyle: _datasets[BSSID].color };
        _plot.addTimeSeries(_datasets[BSSID].line, options);
        _datasets[BSSID].inPlot = true;
      }
    };

    var _unselectAP = function(BSSID) {
      if (_datasets[BSSID].inPlot) {
        _plot.removeTimeSeries(_datasets[BSSID].line);
        _datasets[BSSID].inPlot = false;
      }
    };

    var _applyAPSelection = function() {
      for (var BSSID in _datasets) {
        if (_isSelected[BSSID] || _showAll) {
          _selectAP(BSSID);
        } else {
          _unselectAP(BSSID);
        }
      }
    };

    var _onFilterSettingsChange = function(settings) {
      _isSelected = {};
      for (var i = 0; i < settings.selectedBSSIDs.length; ++i) {
        _isSelected[settings.selectedBSSIDs[i]] = true;
      }
      _showAll = settings.showAll;
      _applyAPSelection();
      filterSettingsService.requestSettings('plot').done(_onFilterSettingsChange);
    };

    var _updateDatasets = function() {
      var curTime = new Date().getTime(),
          APData = APService.getNamedAPData(),
          APDataMap = {};

      for (var i = 0; i < APData.length; ++i) {
        APDataMap[APData[i].BSSID] = APData[i];
      }

      // Update existing datasets
      for (var BSSID in _datasets) {
        var AP = APDataMap[BSSID];
        if (AP) {
          _datasets[BSSID].line.append(curTime, AP.level);
        } else {
          _datasets[BSSID].line.append(curTime, -100);
        }
      }

      // Discover new datasets
      for (var i = 0; i < APData.length; ++i) {
        var AP = APData[i];
        if (! _datasets[AP.BSSID]) {
          _addAP(AP);
          _datasets[AP.BSSID].line.append(curTime, AP.level);
        }
      }
    };

    var _update = function() {
      _updateDatasets();
      _applyAPSelection();
    };

    _plot = new SmoothieChart(
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

    var settings = filterSettingsService.getInitSettings('plot');
    for (var i = 0; i < settings.selectedBSSIDs.length; ++i) {
      _isSelected[settings.selectedBSSIDs[i]] = true;
    }
    _showAll = settings.showAll;
    filterSettingsService.requestSettings('plot').done(_onFilterSettingsChange);

    setInterval(_update, 1000);

    return service;
}]);
