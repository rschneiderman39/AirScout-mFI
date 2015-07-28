app.factory('globalSettings', ['$timeout', function($timeout) {
  var service = {};

  service.detectHidden = function(option) {
    if (typeof option === 'undefined') {
      return detectHidden;
    } else if (typeof newVal === 'boolean') {
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
