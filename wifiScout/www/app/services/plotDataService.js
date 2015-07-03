app.factory('plotDataService', ['APService', 'filterSettingsService',
  'APSelectorService', function(APService, filterSettingsService,
  APSelectorService) {
    var service = {},
        _dataManager = {},
        _selectedBSSIDs = [],
        _orderedBSSIDs = [],
        _orderedSSIDs = [],
        _orderedLevels = [],
        _orderedColors = [],
        _colorPool = [],
        _colorIndex = 0,
        _DATA_POINTS = 20,
        _UPDATE_INTERVAL = 1000;

    var _update = function() {
      _updateNo();
      setTimeout(_update, _UPDATE_INTERVAL);
    };

    /* Helper function. Add a new AP to our model */
    var _addAP = function(APData) {
      var initLevels = Array.apply(null, Array(_DATA_POINTS))
                                        .map(Number.prototype.valueOf,-100);
      initLevels.shift();
      initLevels.push(newData.level);

      _dataManager[newData.BSSID] = {
        levelsRef: initLevels,
        index: _orderedBSSIDs.length,
        exists: true
      };

      _orderedBSSIDs.push(newData.BSSID);
      _orderedSSIDs.push(newData.SSID);
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
    var _updateNow = function() {
      var _selectedAPData = APSelectorService.filter(APService.getNamedAPData(),
                                                     _selectedBSSIDs);
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
    };

    return service;
  }]);
