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
        window.localStorage.setItem('globalAccessPointSelection', JSON.stringify(option));

        $.each(filterableViews, function(i, view) {
          document.dispatchEvent(new Event(events.newAccessPointSelection[view]));
        });
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
        return utils.deepCopy(selections['global']);
      } else {
        return utils.deepCopy(selections[view]);
      }
    };

    service.setAccessPointSelection = function(view, newSelection) {
      if (newSelection.macAddrs instanceof Array &&
          typeof newSelection.showAll === 'boolean') {
        if (globalAccessPointSelection) {
          selections['global'] = utils.deepCopy(newSelection);

          $.each(filterableViews, function(i, view) {
            document.dispatchEvent(new Event(events.newAccessPointSelection[view]));
          });

        } else {
          selections[view] = utils.deepCopy(newSelection);

          document.dispatchEvent(new Event(events.newAccessPointSelection[view]));
        }
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
      detectHidden = JSON.parse(window.localStorage.getItem('detectHidden')) || defaults.detectHidden;
      globalAccessPointSelection = JSON.parse(window.localStorage.getItem('globalAccessPointSelection')) || defaults.globalAccessPointSelection;
      startingView = window.localStorage.getItem('startingView') || defaults.startingView;

      $.each(filterableViews, function(i, view) {
        selections[view] = {
          macAddrs: [],
          showAll: true
        };
      });

      selections['global'] = {
        macAddrs: [],
        showAll: true
      };
    };

    init();

  });

  return service;
}]);
