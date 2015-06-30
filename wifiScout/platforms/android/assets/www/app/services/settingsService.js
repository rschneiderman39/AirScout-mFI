app.factory('settingsService', function() {
  var service = {},
      settings = {},
      views = ['table'];

  for (var i = 0; i < views.length; ++i) {
    settings[views[i]] = {
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
  }

  service.getSettings = function(view) {
    return settings[view].settings;
  };
  service.getSettingsImmediate = function(view) {
    var old_settings = settings[view].settings;
    settings[view].settings = $.Deferred();
    return old_settings.resolve(
      {
        selectedBSSIDs: settings[view].selectedBSSIDs,
        showAll: settings[view].showAll,
        sortPredicate: settings[view].sortPredicate,
        sortReverse: settings[view].sortReverse,
      }
    );
  };
  service.setSelectedBSSIDs = function(view, selected) {
    if (typeof selected === 'object') {
      settings[view].selectedBSSIDs = selected.slice();
      settings[view].resolveSettings();
    }
  };
  service.setShowAll = function(view, showAll) {
    if (typeof showAll === 'boolean') {
      settings[view].showAll = showAll;
      settings[view].resolveSettings();
    }
  };
  service.setSortPredicate = function(view, predicate) {
    if (typeof predicate === 'string') {
      settings[view].sortPredicate = predicate;
      settings[view].resolveSettings();
    }
  };
  service.setSortReverse = function(view, reverse) {
    if (typeof reverse === 'boolean') {
      settings[view].sortReverse = reverse;
      settings[view].resolveSettings();
    }
  };

  return service;
});
