/* Stores the filter settings for all view that use a filter modal. Pushes
   new settings to listening services whenever they are changed.
*/
app.factory('filterSettingsService', function() {
  var service = {},
      _settings = {},
      _views = ['table', 'plot']; // Views that will use this service

  /* Get a deferred object which will be resolved to a view's settings whenever
     those settings are changed.
     @param {String} view The name of the view that's fetching the settings
     @returns {Deferred} A deferred object that will be resolved whenever
              the settings for a view are changed.  In order to continuously
              listen for settings changes, a service can include requestSettings
              as part of the success callback for the returned deferred object.
              The deferred object will resolve to a settings object of the form:
                {
                  selectedBSSIDs: <Array>,
                  showAll: <Boolean>,
                  sortPredicate: <String>,
                  sortReverse: <Boolean>
                }
  */
  service.requestSettings = function(view) {
    return _settings[view].settings;
  };
  /* Get a view's settings. Intended only for view initialization.
     @param {String} The name of the view that's fetching the settings
     @returns {Object} A settings object of the form:
       {
         selectedBSSIDs: <Array>,
         showAll: <Boolean>,
         sortPredicate: <String>,
         sortReverse: <Boolean>
       }
  */
  service.getInitSettings = function(view) {
    return {
        selectedBSSIDs: _settings[view].selectedBSSIDs,
        showAll: _settings[view].showAll,
        sortPredicate: _settings[view].sortPredicate,
        sortReverse: _settings[view].sortReverse
    };
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
