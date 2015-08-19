"use strict";

app.factory('globalSettings', ['$timeout', 'setupService', function($timeout,
setupService) {

  var service = {};

  setupService.ready.then(function() {

    var detectHidden,
        maxSignal,
        minSignal,
        currentSelection,
        updatesPaused = false;

    service.detectHidden = function(option) {
      if (option === undefined) {
        return detectHidden;
      }

      if (typeof option === 'boolean') {
        detectHidden = option;
        window.localStorage.setItem('detectHidden', JSON.stringify(option));
      }
    };

    service.accessPointSelection = function(newSelection) {
      if (newSelection === undefined) {
        return currentSelection;
      }

      if (newSelection instanceof AccessPointSelection) {
        currentSelection = newSelection;
        document.dispatchEvent(new Event(events.newSelection));
      }
    };

    service.maxSignal = function(newMax) {
      if (newMax === undefined) {
        return maxSignal;
      }

      if (typeof newMax === 'number' && newMax > minSignal) {
        maxSignal = newMax;
        window.localStorage.setItem('maxSignal', JSON.stringify(newMax));
      }
    };

    service.minSignal = function(newMin) {
      if (newMin === undefined) {
        return minSignal;
      }

      if (typeof newMin === 'number' && newMin < maxSignal) {
        minSignal = newMin;
        window.localStorage.setItem('minSignal', JSON.stringify(newMin));
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
      detectHidden = JSON.parse(window.localStorage.getItem('detectHidden')) ||
                     defaults.detectHidden;

      minSignal = JSON.parse(window.localStorage.getItem('minSignal')) ||
                 constants.signalFloor;

      maxSignal = JSON.parse(window.localStorage.getItem('maxSignal')) ||
                  defaults.maxSignal;

      currentSelection = new AccessPointSelection([], true);
    };

    init();

  });

  return service;
}]);
