"use strict";

app.factory('globalSettings', ['$rootScope', '$timeout', 'setupSequence',
function($rootScope, $timeout, setupSequence) {

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
        $rootScope.$broadcast(events.newSelection);
      }
    };

    service.visScaleMax = function(newMax) {
      if (newMax === undefined) {
        return visScaleMax;
      }

      if (typeof newMax === 'number' && newMax >= visScaleMin &&
          newMax >= constants.signalFloor && newMax <= constants.signalCeil) {

        visScaleMax = newMax;
        window.localStorage.setItem('visScaleMax', JSON.stringify(newMax));
      }
    };

    service.visScaleMin = function(newMin) {
      if (newMin === undefined) {
        return visScaleMin;
      }

      if (typeof newMin === 'number' && newMin <= visScaleMax &&
          newMin >= constants.signalFloor && newMin <= constants.signalCeil) {

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
                     defaults.detectHidden;

      visScaleMin = JSON.parse(window.localStorage.getItem('visScaleMin')) ||
                 constants.signalFloor;

      visScaleMax = JSON.parse(window.localStorage.getItem('visScaleMax')) ||
                  defaults.visScaleMax;

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
