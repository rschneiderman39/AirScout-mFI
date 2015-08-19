"use strict";

app.factory('globalSettings', ['$timeout', 'setupService', function($timeout,
setupService) {

  var service = {};

  setupService.ready.then(function() {

    var detectHidden = false,
        globalAccessPointSelection = false,
        startingView = undefined,
        updatesPaused = false,
        selections = {},
        filterableViews = defaults.filterableViews;

    service.detectHidden = function(option) {
      if (option === undefined) {
        return detectHidden;
      } else if (typeof option === 'boolean') {
        detectHidden = option;
        window.localStorage.setItem('detectHidden', JSON.stringify(option));
      }
    };

    service.globalAccessPointSelection = function(option) {
      if (option === undefined) {
        return globalAccessPointSelection;
      } else if (typeof option === 'boolean' && option != globalAccessPointSelection) {

        globalAccessPointSelection = option;
        window.localStorage.setItem('globalAccessPointSelection',
                                     JSON.stringify(option));
      }
    };

    service.startingView = function(view) {
      if (view === undefined) {
        return startingView;
      } else if (utils.isView(view)) {
        startingView = view;
        window.localStorage.setItem('startingView', view);
      }
    };

    service.getAccessPointSelection = function(view) {
      if (globalAccessPointSelection) {
        return selections['global'];
      } else {
        return selections[view];
      }
    };

    service.setAccessPointSelection = function(view, newSelection) {
      if (newSelection instanceof AccessPointSelection) {
        if (globalAccessPointSelection) {
          selections['global'] = newSelection;
        } else {
          selections[view] = newSelection;
        }

        document.dispatchEvent(new Event(events.newSelection));
      }
    };

    service.updatesPaused = function(option) {
      if (option === undefined) {
        return updatesPaused;
      } else if (typeof option === 'boolean') {
        updatesPaused = option;
      }
    };

    // Create an associative settings array for each view that will
    // use this service
    function init() {
      detectHidden =
        JSON.parse(window.localStorage.getItem('detectHidden')) ||
        defaults.detectHidden;

      globalAccessPointSelection =
        JSON.parse(window.localStorage.getItem('globalAccessPointSelection')) ||
        defaults.globalAccessPointSelection;

      startingView =
        window.localStorage.getItem('startingView') ||
        defaults.startingView;

      $.each(filterableViews, function(i, view) {
        selections[view] = new AccessPointSelection([], true);
      });

      selections['global'] = new AccessPointSelection([], true);
    };

    init();

  });

  return service;
}]);
