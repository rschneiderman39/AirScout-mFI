// holds the filter settings for view that use the filter modal
app.factory('filterSettingsService', function() {
  var service = {},
      _settings = {},
      _views = ['table', 'plot']; // Views that will use this service

  service.requestSettings = function(view) {
    return _settings[view].settings;
  };
  service.requestInitSettings = function(view) {
    var init_settings = _settings[view].settings;
    _settings[view].settings = $.Deferred();
    return init_settings.resolve(
      {
        selectedBSSIDs: _settings[view].selectedBSSIDs,
        showAll: _settings[view].showAll,
        sortPredicate: _settings[view].sortPredicate,
        sortReverse: _settings[view].sortReverse
      }
    );
  };
  service.setSelectedBSSIDs = function(view, selected) {
    if (typeof selected === 'object') {
      _settings[view].selectedBSSIDs = selected.slice();
      _settings[view].pushSettings();
    }
  };
  service.setShowAll = function(view, showAll) {
    if (typeof showAll === 'boolean') {
      _settings[view].showAll = showAll;
      _settings[view].pushSettings();
    }
  };
  service.setSortPredicate = function(view, predicate) {
    if (typeof predicate === 'string') {
      _settings[view].sortPredicate = predicate;
      _settings[view].pushSettings();
    }
  };
  service.setSortReverse = function(view, reverse) {
    if (typeof reverse === 'boolean') {
      _settings[view].sortReverse = reverse;
      _settings[view].pushSettings();
    }
  };

  // Create an associative settings array for each view that will
  // use this service
  for (var i = 0; i < _views.length; ++i) {
    _settings[_views[i]] = {
      selectedBSSIDs: [],
      showAll: true,
      sortPredicate: 'SSID',
      sortReverse: false,
      settings: $.Deferred(),
      pushSettings: function() {
        var old_settings = this.settings;
        this.settings = $.Deferred();
        old_settings.resolve(
          {
            selectedBSSIDs: this.selectedBSSIDs.slice(),
            showAll: this.showAll,
            sortPredicate: this.sortPredicate,
            sortReverse: this.sortReverse
          }
        );
      }
    };
  }

  if (typeof _settings['plot'] !== 'undefined') {
    _settings['plot'].showAll = false;
  }

  return service;
});
