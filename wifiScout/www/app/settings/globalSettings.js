"use strict";

app.factory('globalSettings', ['$rootScope', '$timeout', 'globals', 'setupSequence',
function($rootScope, $timeout, globals, setupSequence) {

  var service = {};

  setupSequence.done.then(function() {

    var detectHidden,
        visScaleMax,
        visScaleMin,
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
        $rootScope.$broadcast(globals.events.newSelection);
      }
    };

    service.visScaleMax = function(newMax) {
      if (newMax === undefined) {
        return visScaleMax;
      }

      if (typeof newMax === 'number' && newMax >= visScaleMin &&
          newMax >= globals.constants.signalFloor && newMax <= globals.constants.signalCeil) {

        visScaleMax = newMax;
        window.localStorage.setItem('visScaleMax', JSON.stringify(newMax));
      }
    };

    service.visScaleMin = function(newMin) {
      if (newMin === undefined) {
        return visScaleMin;
      }

      if (typeof newMin === 'number' && newMin <= visScaleMax &&
          newMin >= globals.constants.signalFloor && newMin <= globals.constants.signalCeil) {

        visScaleMin = newMin;
        window.localStorage.setItem('visScaleMin', JSON.stringify(newMin));
      }
    };

    service.updatesPaused = function() {
      return updatesPaused;
    };

    // Create an associative settings array for each view that will
    // use this service
    function init() {
      detectHidden = JSON.parse(window.localStorage.getItem('detectHidden')) ||
                     globals.defaults.detectHidden;

      visScaleMin = JSON.parse(window.localStorage.getItem('visScaleMin')) ||
                 globals.constants.signalFloor;

      visScaleMax = JSON.parse(window.localStorage.getItem('visScaleMax')) ||
                  globals.defaults.visScaleMax;

      currentSelection = new AccessPointSelection([], true);

      $(document).on('pause', function() {
        updatesPaused = true;
      });

      $(document).on('resume', function() {
        updatesPaused = false;
      });
    };

    init();

  });

  return service;
}]);
