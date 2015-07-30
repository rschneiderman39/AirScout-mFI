app.factory('globalSettings', ['$timeout', 'setupService', function($timeout,
setupService) {

  var service = {};

  setupService.ready.then(function() {
    service.detectHidden = function(option) {
      if (option === undefined) {
        return detectHidden;
      } else if (typeof option === 'boolean') {
        detectHidden = option;
        window.localStorage.setItem('detectHidden', JSON.stringify(option));
      }
    };

    service.globalSelection = function(option) {
      if (option === undefined) {
        return globalSelection;
      } else if (typeof option === 'boolean') {
        if (option != globalSelection) {
          globalSelection = option;
          window.localStorage.setItem('globalSelection', JSON.stringify(option));
          if (option) {
            for (var i = 0; i < filterableViews.length; ++i) {
              selections[filterableViews[i]] = globals.utils.deepCopy(selections['global']);
            }
          }
          for (var i = 0; i < filterableViews.length; ++i) {
            var curView = filterableViews[i];
            sendSelection(curView, selections[curView]);
          }
        }
      }
    };

    service.startingView = function(view) {
      if (view === undefined) {
        return startingView;
      } else if (globals.utils.isView(view)) {
        startingView = view;
        window.localStorage.setItem('startingView', view);
      }
    };

    service.awaitNewSelection = function(view) {
      return selectionPromises[view];
    };

    service.getSelection = function(view) {
      if (globalSelection) {
        return globals.utils.deepCopy(selections['global']);
      } else {
        return globals.utils.deepCopy(selections[view]);
      }
    };

    service.setSelection = function(view, newSelection) {
      if (newSelection.selectedBSSIDs instanceof Array &&
          typeof newSelection.showAll === 'boolean') {
        if (globalSelection) {
          for (var i = 0; i < filterableViews.length; ++i) {
            var curView = filterableViews[i];
            selections[curView] = globals.utils.deepCopy(newSelection);
            sendSelection(curView, newSelection);
          }
          selections['global'] = globals.utils.deepCopy(newSelection);
        } else {
          selections[view] = globals.utils.deepCopy(newSelection);
          sendSelection(view, newSelection);
        }
      }
    };

    var detectHidden = false,
        globalSelection = false,
        startingView = undefined,
        selections = {},
        selectionPromises = {},
        filterableViews = globals.defaults.filterableViews;

    var sendSelection = function(view, selection) {
      $timeout(function() {
        var request = selectionPromises[view];
        selectionPromises[view] = $.Deferred();
        request.resolve(globals.utils.deepCopy(selection));
      });
    };

    // Create an associative settings array for each view that will
    // use this service
    var init = function(){
      detectHidden = JSON.parse(window.localStorage.getItem('detectHidden')) || globals.defaults.detectHidden;
      globalSelection = JSON.parse(window.localStorage.getItem('globalSelection')) || globals.defaults.globalSelection;
      startingView = window.localStorage.getItem('startingView') || globals.defaults.startingView;

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

  });

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
