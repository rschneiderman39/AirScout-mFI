/* Stores the filter settings for all view that use a filter modal. Pushes
   new settings to listening services whenever they are changed.
*/
app.factory('filterSettingsService', function() {
  var service = {},
      settings = {},
      views = ['table', 'plot', 'parabola']; // Views that will use this service

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
    return settings[view].settingsPromise;
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
        selectedBSSIDs: settings[view].selectedBSSIDs,
        showAll: settings[view].showAll,
        sortPredicate: settings[view].sortPredicate,
        sortReverse: settings[view].sortReverse
    };
  };
  service.setSelectedBSSIDs = function(view, selected) {
    if (typeof selected === 'object') {
      settings[view].selectedBSSIDs = selected.slice();
      pushSettings(view);
    }
  };
  service.setShowAll = function(view, showAll) {
    if (typeof showAll === 'boolean') {
      settings[view].showAll = showAll;
      pushSettings(view);
    }
  };
  service.setSortPredicate = function(view, predicate) {
    if (typeof predicate === 'string') {
      settings[view].sortPredicate = predicate;
      pushSettings(view);
    }
  };
  service.setSortReverse = function(view, reverse) {
    if (typeof reverse === 'boolean') {
      settings[view].sortReverse = reverse;
      pushSettings(view);
    }
  };

  var pushSettings = function(view) {
    var viewSettings = settings[view],
        request = viewSettings.settingsPromise;
    viewSettings.settingsPromise = $.Deferred();
    request.resolve(
      {
        selectedBSSIDs: viewSettings.selectedBSSIDs.slice(),
        showAll: viewSettings.showAll,
        sortPredicate: viewSettings.sortPredicate,
        sortReverse: viewSettings.sortReverse
      }
    );
  };

  // Create an associative settings array for each view that will
  // use this service
  for (var i = 0; i < views.length; ++i) {
    settings[views[i]] = {
      selectedBSSIDs: [],
      showAll: true,
      sortPredicate: 'SSID',
      sortReverse: false,
      settingsPromise: $.Deferred()
    };
  }

  return service;
});
