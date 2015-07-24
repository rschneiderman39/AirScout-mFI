/* Stores the filter settings for all view that use a filter modal. Pushes
   new settings to listening services whenever they are changed.
*/
app.factory('filterSettings', ['$timeout', 'globalSettings', function($timeout) {
  var service = {},
      settings = {},
      views = ['channelGraph', 'timeGraph', 'APTable', 'global'];

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

  service.request = function(view) {
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
  service.get = function(view) {
    return {
        selectedBSSIDs: settings[view].selectedBSSIDs,
        showAll: settings[view].showAll,
    };
  };

  service.set = function(view, newSettings) {
    if (newSettings.selectedBSSIDs instanceof Array &&
        typeof newSettings.showAll === 'boolean') {
      settings[view].selectedBSSIDs = newSettings.selectedBSSIDs.slice();
      settings[view].showAll = newSettings.showAll;
      pushSettings(view);
    } else {
      console.log('false');
    }
  };

  var pushSettings = function(view) {
    // Wait for any digest cycle to finish before causing another one.
    $timeout(function() {
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
    });
  };

  // Create an associative settings array for each view that will
  // use this service
  for (var i = 0; i < views.length; ++i) {
    settings[views[i]] = {
      selectedBSSIDs: [],
      showAll: true,
      settingsPromise: $.Deferred()
    };
  }

  return service;
}]);
