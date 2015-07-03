app.factory('plotDataService', ['APService', 'filterSettingsService',
  'APSelectorService', 'cordovaService', function(APService,
  filterSettingsService, APSelectorService, cordovaService)]) {
    var service = {},
        _dataManager = {},
        _orderedBSSIDs = [],
        _selectedBSSIDs = [],
        _rawSSIDs = [],
        _rawLevelData = [],
        _DATA_POINTS = 10,
        _UPDATE_INTERVAL = 1000;

    var _update = function() {
      _forceUpdate();
      setTimeout(_update, _UPDATE_INTERVAL);
    };

    var _forceUpdate = function() {
      _updateDataManager();
    };

    var _updateDataManager = function() {
      var APData = APSelectorService.filter(APService.getNamedAPData(),
                                            _selectedBSSIDs);
      for (var i = 0; i < APData.length; ++i) {
        var newData = APData[i],
            localData = _dataManager[newData.BSSID];
        if (typeof localData !== 'undefined') {
          localData.levels.shift();
          localData.levels.push(newData.level);
        } else {
          var levels =
          _dataManager[newData.BSSID] = {
            level:


          }
        }
      }

    }


  }]);
