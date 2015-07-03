app.factory('plotDataService', ['APService', 'filterSettingsService',
  'APSelectorService', function(APService, filterSettingsService,
  APSelectorService) {
    /* PARAMS */
    var _UPDATE_INTERVAL = 2000,
        _WINDOW_SIZE_SECONDS = 30;

    var service = {},
        _dataManager = {},
        _selectedBSSIDs = [],
        _showAll = false,
        _orderedBSSIDs = [],
        _orderedSSIDs = [],
        _orderedLevels = [],
        _orderedColors = [],
        _labels = [],
        _options = {
					animation: false,
					scaleOverride: true,
					scaleStartValue: -100,
					scaleStepWidth: 10,
					scaleSteps: 7,
					datasetFill: false,
					pointDot: false,
				},
        _plotData = $.Deferred(),
        _numDataPoints;

    service.getInitPlotData = function() {
      var initData = _plotData;
      _plotData = $.Deferred();
      return initData.resolve(
        {
          orderedSSIDs: _orderedSSIDs.slice(),
          orderedLevels: _orderedLevels.slice(),
          orderedColors: _orderedColors.slice()
        }
      );
    };
    service.getPlotData = function() {
      return _plotData;
    }
    service.getLabels = function() {
      return _labels;
    };
    service.getOptions = function() {
      return _options;
    };



    var _pushPlotData = function() {
      var oldData = _plotData;
      _plotData = $.Deferred();
      oldData.resolve(
        {
          orderedSSIDs: _orderedSSIDs.slice(),
          orderedLevels: _orderedLevels.slice(),
          orderedColors: _orderedColors.slice()
        }
      );
    }



    var _getRandomColor = function() {
      var r = (Math.floor(Math.random() * 256)).toString(16),
          g = (Math.floor(Math.random() * 256)).toString(16),
          b = (Math.floor(Math.random() * 256)).toString(16);

      return '#' + r + g + b;
    };



    /* Helper function. Add a new AP to our model */
    var _addAP = function(APData) {
      /* Create an array of length DATA_POINTS filled with -100 (Our arbitrary
         "0" value for RSSI) */
      var initLevels = Array.apply(null, Array(_numDataPoints))
                                        .map(Number.prototype.valueOf,-100);
      initLevels.shift();
      initLevels.push(APData.level);

      _dataManager[APData.BSSID] = {
        levelsRef: initLevels,
        index: _orderedBSSIDs.length,
        inRange: true,
        timeOutOfRange: 0
      };

      _orderedBSSIDs.push(APData.BSSID);
      _orderedSSIDs.push(APData.SSID);
      _orderedLevels.push(initLevels);
      _orderedColors.push(_getRandomColor());
    };



    var removeAP = function(index, BSSID) {
      delete _dataManager[BSSID];
      _orderedBSSIDs.splice(index, 1);
      _orderedSSIDs.splice(index, 1);
      _orderedLevels.splice(index, 1);
      _orderedColors.splice(index, 1);
    };



    var _removeOutOfRangeAPs = function() {
      for (var i = 0; i < _orderedBSSIDs.length; ++i) {
        var BSSID = _orderedBSSIDs[i];
        /* If the AP is still in data manager, but wasn't in the last data set,
           it has gone out of range.  Remove it from the data model if it has
           been out of range for longer than the plot window. */
        if (! _dataManager[BSSID].inRange) {
          _dataManager[BSSID].levelsRef.shift();
          _dataManager[BSSID].levelsRef.push(-100);
          if (++_dataManager[BSSID].timeOutOfRange > _numDataPoints) {
            removeAP(i, BSSID);
            --i;
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



    var _removeUnselectedAPs = function() {
      /* Convert _selectedBSSIDs into a map so the membership check
         can be done in O(n) time. */
      var selectedBSSIDMap = {};
      for (var i = 0; i < _selectedBSSIDs.length; ++i) {
        selectedBSSIDMap[_selectedBSSIDs[i]] = true;
      }
      /* Remove any APs not in _selectedBSSIDs */
      for (var i = 0; i < _orderedBSSIDs.length; ++i) {
        var BSSID = _orderedBSSIDs[i];
        if (selectedBSSIDMap[BSSID] !== true) {
          if (BSSID !== 'placeholder') {
            removeAP(i, BSSID);
            --i;
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
          localData.levelsRef.shift();
          localData.levelsRef.push(newData.level);
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
      if (_orderedBSSIDs.length === 0) {
        _insertPlaceholderAP();
      }
    };



    var _insertPlaceholderAP = function() {
      if (typeof _dataManager['placeholder'] === 'undefined' &&
          _orderedBSSIDs.length === 0) {
        var initLevels = Array.apply(null, Array(_numDataPoints))
                                          .map(Number.prototype.valueOf,-100);
        _dataManager['placeholder'] = {
          levelsRef: initLevels,
          index: 0,
          inRange: true,
          timeOutOfRange: 0
        };
        _orderedBSSIDs.push('placeholder');
        _orderedSSIDs.push("");
        _orderedLevels.push(initLevels);
        _orderedColors.push('#EEEEEE');
      }
    };



    var _removePlaceholderAP = function() {
      if (typeof _dataManager['placeholder'] !== 'undefined') {
        removeAP(0, 'placeholder');
      }
    };



    var _onSettingsChange = function(settings) {
      _selectedBSSIDs = settings.selectedBSSIDs;
      _showAll = settings.showAll;
      filterSettingsService.getSettings('plot').done(_onSettingsChange);
    };



    /* Update our model every UPDATE_INTERVAL */
    var _update = function() {
      _updateModel();
      _pushPlotData();
      setTimeout(_update, _UPDATE_INTERVAL);
    };

    /* Init */
    for (var i = _WINDOW_SIZE_SECONDS; i >= 0; i -= _UPDATE_INTERVAL / 1000) {
      _labels.push(i.toString());
    };
    _numDataPoints = _labels.length;

    filterSettingsService.getInitSettings('plot').done(
      function(settings) {
        _selectedBSSIDs = settings.selectedBSSIDs;
        _showAll = settings.showAll;
        filterSettingsService.getSettings('plot').done(_onSettingsChange);
        _update();
      }
    )

    return service;
  }]);
