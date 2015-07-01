app.factory('APService', ['rawDataService', function(rawDataService) {
  var service = {},
      _allAPs = [],
      _namedAPs = [],
      _minLevels = {},
      _maxLevels = {};

  service.getAllAPs = function() {
    return _allAPs;
  };
  service.getNamedAPs = function() {
    return _namedAPs;
  };
  service.getMinLevel = function(BSSID) {
    var minLevel = _minLevels[BSSID];
    if (typeof minLevel !== 'undefined') {
      return minLevel;
    } else {
      return -100;
    }
  };
  service.getMaxLevel = function(BSSID) {
    var maxLevel = _maxLevels[BSSID];
    if (typeof maxLevel !== 'undefined') {
      return maxLevel;
    } else {
      return -100;
    }
  };

  var _updateMinLevels = function() {
    for (var i = 0; i < _allAPs.length; ++i) {
      var ap = _allAPs[i];
      var minLevel = _minLevels[ap.BSSID];
      if (typeof minLevel !== 'undefined') {
        if (ap.level < minLevel) {
          _minLevels[ap.BSSID] = ap.level;
        }
      } else {
        _minLevels[ap.BSSID] = ap.level;
      }
    }
  };

  var _updateMaxLevels = function() {
    for (var i = 0; i < _allAPs.length; ++i) {
      var ap = _allAPs[i];
      var maxLevel = _maxLevels[ap.BSSID];
      if (typeof maxLevel !== 'undefined') {
        if (ap.level > maxLevel) {
          _maxLevels[ap.BSSID] = ap.level;
        }
      } else {
        _maxLevels[ap.BSSID] = ap.level;
      }
    }
  };

  var _update = function() {
    rawDataService.getInfo()
    .done(function(info) {
      _allAPs = info.available;
      _namedAPs = info.available.filter(
        function(ap) { return ap.SSID !== ""; }
      );
      _updateMinLevels();
      _updateMaxLevels();
    })
    .fail(function() {
      _allAPs = [];
      _namedAPs = [];
    });
    setTimeout(_update, 100);
  };

  _update();

  return service;
}]);
