"use strict";
/*
* Responsible for parsing raw access point data into a format
* compatible with ChartJS.
*/
app.factory('plotDataService', ['APService', 'filterSettingsService',
  'APSelectorService', function(APService, filterSettingsService,
  APSelectorService) {
    /* PARAMS */
    var _INIT_UPDATE_INTERVAL = 1000,
        _WINDOW_SIZE_SECONDS = 60;

    var service = {},
        _dataManager = {},     // Maps BSSIDs to their data
        _selectedBSSIDs = [],  // The set of BSSIDs the user wants to see
        _showAll = false,      // If true, all known APs will be included in plot
        _datasets = [],
        _labels = [],
        _options = {
					animation: false,
					scaleOverride: true,
					scaleStartValue: -100,
					scaleStepWidth: 10,
					scaleSteps: 7,
					datasetFill: false,
					pointDot: false,
          bezierCurve: false
				},
        _plotData = $.Deferred(),
        _updateInterval,
        _numDataPoints;

    service.requestInitPlotData = function() {
      var initData = _plotData;
      _plotData = $.Deferred();
      return initData.resolve(_datasets.slice());
    };
    service.requestPlotData = function() {
      return _plotData;
    };
    service.getLabels = function() {
      return _labels;
    };
    service.getOptions = function() {
      return _options;
    };
    service.getInterval = function() {
      return _updateInterval;
    };
    service.enablePerformanceMode = function() {
      for (var i = 0; i < _datasets.length; ++i) {
        var newLevels = [];
        for (var j = 0; j < _datasets[i].data.length; j += 2) {
          newLevels.push(_datasets[i].data[j]);
        }
        _datasets[i].data = newLevels;
      }
      _updateInterval *= 2;
      _generateLabels();
    };
    service.enableNormalMode = function() {
      for (var i = 0; i < _datasets.length; ++i) {
        var newLevels = [];
        for (var j = 0; j < _datasets[i].data.length - 1; ++j) {
          newLevels.push(_datasets[i].data[j]);
          newLevels.push(_datasets[i].data[j]);
        }
        newLevels.push(_datasets[i].data[_datasets[i].data.length - 1]);
        _dataManager[_datasets[i].BSSID].datasetRef.data = newLevels;
      }
      _updateInterval /= 2;
      _generateLabels();
    };


    /* Build a dataset object that's compatible with Chart JS's data model */
    var _makeDataset = function(BSSID, SSID, levels, color) {
      return {
        BSSID: BSSID,
        label: SSID,
        fillColor: color,
        strokeColor: color,
        pointColor: color,
        pointStrokeColor: color,
        data: levels
      };
    };


    /* Send plot data to the controller */
    var _pushPlotData = function() {
      var oldData = _plotData;
      _plotData = $.Deferred();
      oldData.resolve(_datasets.slice());
    };


    /* Returns a random color in the format used by Chart JS */
    var _getRandomRGBA = function() {
      var r = (Math.floor(Math.random() * 256)).toString(10),
          g = (Math.floor(Math.random() * 256)).toString(10),
          b = (Math.floor(Math.random() * 256)).toString(10);

      return 'rgba(' + r + ',' + g + ',' + b + ',' + '1)';
    };



    /* Add a new AP to the model */
    var _addAP = function(APData) {
      /* Create an array of length DATA_POINTS filled with -100 (Our arbitrary
         "0" value for RSSI) */
      var initLevels = Array.apply(null, Array(_numDataPoints))
                                        .map(Number.prototype.valueOf,-100),
          initDataset;

      initLevels.shift();
      initLevels.push(APData.level);

      initDataset = _makeDataset(APData.BSSID, APData.SSID, initLevels, _getRandomRGBA());

      _dataManager[APData.BSSID] = {
        datasetRef: initDataset,
        index: _datasets.length,
        inRange: true,
        timeOutOfRange: 0
      };

      _datasets.push(initDataset);
    };


    /* Remove the dataset corresponding to the passed BSSID */
    var removeAP = function(BSSID) {
      var index = _dataManager[BSSID].index;
      delete _dataManager[BSSID];
      _datasets.splice(index, 1);
      for (var i = index; i < _datasets.length; ++i) {
        _dataManager[_datasets[i].BSSID].index--;
      }
    };


    /* Remove datasets beloning to APs that have been out of range too long */
    var _removeOutOfRangeAPs = function() {
      for (var BSSID in _dataManager) {
        /* If the AP is still in data manager, but wasn't in the last data set,
           it has gone out of range.  Remove it from the data model if it has
           been out of range for longer than the plot window. */
        if (! _dataManager[BSSID].inRange) {
          _dataManager[BSSID].datasetRef.data.shift();
          _dataManager[BSSID].datasetRef.data.push(-100);
          if (++_dataManager[BSSID].timeOutOfRange > _numDataPoints) {
            removeAP(BSSID);
          }
        }
      }
      /* Assume all APs have gone out of range until the next data set
        proves otherwise. */
      for (var BSSID in _dataManager) {
        _dataManager[BSSID].inRange = false;
      }
      if (typeof _dataManager['placeholder'] !== 'undefined') {
        _dataManager['placeholder'].inRange = true;
      }
    };


    /* Remove datasets belonging to APs that have been unselected */
    var _removeUnselectedAPs = function() {
      /* Convert _selectedBSSIDs into a map so the membership check
         can be done in O(n) time. */
      var selectedBSSIDMap = {};
      for (var i = 0; i < _selectedBSSIDs.length; ++i) {
        selectedBSSIDMap[_selectedBSSIDs[i]] = true;
      }
      /* Remove any APs not in _selectedBSSIDs */
      for (var BSSID in _dataManager) {
        if (selectedBSSIDMap[BSSID] !== true) {
          if (BSSID !== 'placeholder') {
            removeAP(BSSID);
          }
        }
      }
    };



    /* Pull new data from APService, and update our model as necessary */
    var _updateModel = function() {
      var selectedAPData;
      if (_showAll) {
        selectedAPData = APService.getNamedAPData();
      } else {
        selectedAPData = APSelectorService.filter(APService.getNamedAPData(),
                                                      _selectedBSSIDs);
      }
      if (selectedAPData.length > 0) {
        _removePlaceholderAP();
      }
      for (var i = 0; i < selectedAPData.length; ++i) {
        var newData = selectedAPData[i],
            localData = _dataManager[newData.BSSID];
        if (typeof localData !== 'undefined') {
          localData.datasetRef.data.shift();
          localData.datasetRef.data.push(newData.level);
          localData.inRange = true;
          localData.timeOutOfRange = 0;
        } else {
          _addAP(newData);
        }
      }
      _removeOutOfRangeAPs();
      if (! _showAll) {
        _removeUnselectedAPs();
      }
      if (_datasets.length === 0) {
        _insertPlaceholderAP();
      }
    };



    /* If no placeholder AP has already been inserted, insert a placeholder
       AP to ensure that datasets is not empty, and the plot can render */
    var _insertPlaceholderAP = function() {
      if (typeof _dataManager['placeholder'] === 'undefined' &&
          _datasets.length === 0) {
        var initLevels = Array.apply(null, Array(_numDataPoints))
                                          .map(Number.prototype.valueOf,-100),
        initDataset = _makeDataset('placeholder', "", initLevels, 'rgba(0,0,0,1)');

        _dataManager['placeholder'] = {
          datasetRef: initDataset,
          index: 0,
          inRange: true,
          timeOutOfRange: 0
        };

        _datasets.push(initDataset);
      }
    };


    /* If a placeholder AP has been inserted, remove it */
    var _removePlaceholderAP = function() {
      if (typeof _dataManager['placeholder'] !== 'undefined') {
        removeAP('placeholder');
      }
    };


    /* Immediately updates filter settings whenever they are changed. */
    var _onSettingsChange = function(settings) {
      _selectedBSSIDs = settings.selectedBSSIDs;
      _showAll = settings.showAll;
      filterSettingsService.requestSettings('plot').done(_onSettingsChange);
    };


    /* Generate labels for the X-axis that are consistent with the
       update interval and time window */
    var _generateLabels = function() {
      _labels = [];
      for (var i = _WINDOW_SIZE_SECONDS; i >= 0; i -= _updateInterval / 1000) {
        if (i % 10 === 0) {
          _labels.push(i.toString());
        } else {
          _labels.push(".");
        }
      };
      _numDataPoints = _labels.length;
    };



    /* Update our model every _updateInterval */
    var _update = function() {
      setTimeout(_update, _updateInterval);
      _updateModel();
      _pushPlotData();
    };


    /* Init */
    _updateInterval = _INIT_UPDATE_INTERVAL;

    _generateLabels();

    filterSettingsService.requestInitSettings('plot').done(
      function(settings) {
        _selectedBSSIDs = settings.selectedBSSIDs;
        _showAll = settings.showAll;
        filterSettingsService.requestSettings('plot').done(_onSettingsChange);
        _update();
      }
    )

    return service;
  }]);
