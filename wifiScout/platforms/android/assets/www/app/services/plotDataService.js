app.factory('plotDataService', ['APService', 'filterSettingsService',
  'APSelectorService', function(APService, filterSettingsService,
  APSelectorService) {
    var service = {},
        _dataManager = {},
        _selectedBSSIDs = [],
        _showAll = false,
        _orderedBSSIDs = [],
        _orderedSSIDs = [],
        _orderedLevels = [],
        _orderedColors = [],
        _colorPool = [
          '#97BBCD', // blue
          '#DCDCDC', // light grey
          '#F7464A', // red
          '#46BFBD', // green
          '#FDB45C', // yellow
          '#949FB1', // grey
          '#4D5360'  // dark grey
        ],
        _colorIndex = 0,
        _DATA_POINTS = 16,
        _UPDATE_INTERVAL = 2000;

    service.getOrderedSSIDs = function() {
      return _orderedSSIDs.slice();
    };
    service.getOrderedLevels = function() {
      return _orderedLevels.slice();
    };
    service.getOrderedColors = function() {
      return _orderedColors.slice();
    };

    /* Update our model every UPDATE_INTERVAL */
    var _update = function() {
      _updateNow();
      setTimeout(_update, _UPDATE_INTERVAL);
    };

    /* Helper function. Add a new AP to our model */
    var _addAP = function(APData) {
      console.log('adding AP: ' + APData.SSID);
      /* Create an array of length DATA_POINTS filled with -100 (Our arbitrary
         "0" value for RSSI) */
      var initLevels = Array.apply(null, Array(_DATA_POINTS))
                                        .map(Number.prototype.valueOf,-100);
      initLevels.shift();
      initLevels.push(APData.level);

      _dataManager[APData.BSSID] = {
        levelsRef: initLevels,
        index: _orderedBSSIDs.length,
        exists: true
      };

      _orderedBSSIDs.push(APData.BSSID);
      _orderedSSIDs.push(APData.SSID);
      _orderedLevels.push(initLevels);
      _orderedColors.push(_colorPool[(_colorIndex++ % _colorPool.length)]);
    };

    /* Helper function. Remove all APs from our model that have
       gone out of range. */
    var _cullAPs = function() {
      for (var i = 0; i < _orderedBSSIDs.length; ++i) {
        var BSSID = _orderedBSSIDs[i];
        /* If the AP is still in data manager, but wasn't in the last data set,
           it has gone out of range.  Remove it from data manager, and update
           the chart values accordingly. */
        if (! _dataManager[BSSID].exists) {
          delete _dataManager[BSSID];
          _orderedBSSIDs.splice(i, 1);
          _orderedSSIDs.splice(i, 1);
          _orderedLevels.splice(i, 1);
          _orderedColors.splice(i, 1);
          --i;
        }
      }
      /* Assume all APs have gone out of range until the next data set
        proves otherwise. */
      for (var BSSID in _dataManager) {
        _dataManager[BSSID].exists = false;
      }
    }

    /* Pull new data from APService, and update our model as necessary */
    var _updateModel = function() {
      var _selectedAPData;
      if (_showAll) {
        _selectedAPData = APService.getNamedAPData();
      } else {
        _selectedAPData = APSelectorService.filter(APService.getNamedAPData(),
                                                      _selectedBSSIDs);
      }
      for (var i = 0; i < _selectedAPData.length; ++i) {
        var newData = _selectedAPData[i],
            localData = _dataManager[newData.BSSID];
        if (typeof localData !== 'undefined') {
          localData.levelsRef.shift();
          localData.levelsRef.push(newData.level);
          localData.exists = true
        } else {
          _addAP(newData);
        }
      }
      _cullAPs();
      console.log('Data model: ' + JSON.stringify(_dataManager));
    };

    var _updateNow = function() {
      filterSettingsService.getSettingsImmediate('plot').done(
        function(settings) {
          _selectedBSSIDs = settings.selectedBSSIDs;
          _showAll = settings.showAll;
          _updateModel();
        }
      );
    };

    /* Init */
    _update();

    return service;
  }]);
