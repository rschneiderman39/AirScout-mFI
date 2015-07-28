app.factory('globalSettings', ['$timeout', 'cordovaService', function($timeout,
cordovaService) {

  var service = {};

  cordovaService.ready.then(function() {

    service.detectHidden = function(option) {
      if (typeof option === 'undefined') {
        return detectHidden;
      } else if (typeof option === 'boolean') {
        detectHidden = option;
        window.localStorage.setItem('detectHidden', option);
      }
    };

    service.globalSelection = function(option) {
      if (typeof option === 'undefined') {
        return globalSelection;
      } else if (typeof option === 'boolean') {
        if (option != globalSelection) {
          globalSelection = option;
          window.localStorage.setItem('globalSelection', option);
          if (option) {
            for (var i = 0; i < FILTERABLE_VIEWS.length; ++i) {
              selections[FILTERABLE_VIEWS[i]] = deepCopy(selections['global']);
            }
          }
          for (var i = 0; i < FILTERABLE_VIEWS.length; ++i) {
            var curView = FILTERABLE_VIEWS[i];
            sendSelection(curView, selections[curView]);
          }
        }
      }
    };

    service.startingView = function(view) {
      if (view === undefined) {
        return startingView;
      } else if (isView(view)) {
        startingView = view;
        window.localStorage.setItem('startingView', view);
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
          for (var i = 0; i < FILTERABLE_VIEWS.length; ++i) {
            var curView = FILTERABLE_VIEWS[i];
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
        globalSelection = false,
        startingView = undefined,
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
      detectHidden = window.localStorage.getItem('detectHidden') || DEFAULT_DETECT_HIDDEN;
      globalSelection = window.localStorage.getItem('globalSelection') || DEFAULT_GLOBAL_SELECTION;
      startingView = window.localStorage.getItem('startingView') || DEFAULT_STARTING_VIEW;

      for (var i = 0; i < FILTERABLE_VIEWS.length; ++i) {
        selections[FILTERABLE_VIEWS[i]] = {
          selectedBSSIDs: [],
          showAll: true
        };
        selectionPromises[FILTERABLE_VIEWS[i]] = $.Deferred();
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
