app.factory('settingsService', function() {
  var _table = {
    selectedBSSIDs: [],
    showAll: true,
    sortPredicate: 'SSID',
    sortReverse: false,
    settings: $.Deferred(),
    resolveSettings: function() {
      var old_settings = this.settings;
      this.settings = $.Deferred();
      old_settings.resolve(
        {
          selectedBSSIDs: this.selectedBSSIDs.slice(),
          showAll: this.showAll,
          sortPredicate: this.sortPredicate,
          sortReverse: this.sortReverse,
        }
      );
    }
  };

  var service = {};

  service.table = {
    getSettings: function() {
      return _table.settings;
    },
    getSettingsImmediate: function() {
      var old_settings = _table.settings;
      _table.settings = $.Deferred();
      return old_settings.resolve(
        {
          selectedBSSIDs: _table.selectedBSSIDs,
          showAll: _table.showAll,
          sortPredicate: _table.sortPredicate,
          sortReverse: _table.sortReverse,
        }
      );
    },
    setSelectedBSSIDs: function(selected) {
      if (typeof selected === 'object') {
        _table.selectedBSSIDs = selected.slice();
        _table.resolveSettings();
      }
    },
    setShowAll: function(showAll) {
      if (typeof showAll === 'boolean') {
        _table.showAll = showAll;
        _table.resolveSettings();
      }
    },
    setSortPredicate: function(predicate) {
      if (typeof predicate === 'string') {
        _table.sortPredicate = predicate;
        _table.resolveSettings();
      }
    },
    setSortReverse: function(reverse) {
      if (typeof reverse === 'boolean') {
        _table.sortReverse = reverse;
        _table.resolveSettings();
      }
    },
  };

  return service;
});
