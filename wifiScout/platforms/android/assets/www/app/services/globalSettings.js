app.factory('globalSettings', ['$timeout', function($timeout) {
  var service = {};

  service.detectHidden = function(option) {
    if (typeof option === 'undefined') {
      return detectHidden;
    } else if (typeof option === 'boolean') {
      detectHidden = option;
    }
  };

  service.globalSelection = function(option) {
    if (typeof option === 'undefined') {
      return globalSelection;
    } else if (typeof option === 'boolean') {
      if (option != globalSelection) {
        globalSelection = option;
        if (option) {
          for (var i = 0; i < filterableViews.length; ++i) {
            selections[filterableViews[i]] = deepCopy(selections['global']);
          }
        }
        for (var i = 0; i < filterableViews.length; ++i) {
          var curView = filterableViews[i];
          sendSelection(curView, selections[curView]);
        }
      }
    }
  };

  service.defaultView = function(option) {
    if (typeof option === 'undefined') {
      return defaultView;
    } else if (typeof option === 'string') {
      defaultView = option;
    }
  };

  service.awaitNewSelection = function(view) {
    return selectionPromises[view];
  };

  service.getSelection = function(view) {
    if (globalSelection) {
      return deepCopy(selections['global']);
    } else {
      return deepCopy(selections[view]);
    }
  };

  service.setSelection = function(view, newSelection) {
    if (newSelection.selectedBSSIDs instanceof Array &&
        typeof newSelection.showAll === 'boolean') {
      if (globalSelection) {
        for (var i = 0; i < filterableViews.length; ++i) {
          var curView = filterableViews[i];
          selections[curView] = deepCopy(newSelection);
          sendSelection(curView, newSelection);
        }
        selections['global'] = deepCopy(newSelection);
      } else {
        selections[view] = deepCopy(newSelection);
        sendSelection(view, newSelection);
      }
    }
  };

  var detectHidden = false,
      globalSelection = true,
      defaultView = 'settings',
      filterableViews = ['channelGraph', 'timeGraph', 'APTable'],
      selections = {},
      selectionPromises = {};

  var sendSelection = function(view, selection) {
    $timeout(function() {
      var request = selectionPromises[view];
      selectionPromises[view] = $.Deferred();
      request.resolve(deepCopy(selection));
    });
  };

  // Create an associative settings array for each view that will
  // use this service
  var init = function(){
    for (var i = 0; i < filterableViews.length; ++i) {
      selections[filterableViews[i]] = {
        selectedBSSIDs: [],
        showAll: true
      };
      selectionPromises[filterableViews[i]] = $.Deferred();
    }

    selections['global'] = {
      selectedBSSIDs: [],
      showAll: true
    };
  };

  init();

  return service;
}]);

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
