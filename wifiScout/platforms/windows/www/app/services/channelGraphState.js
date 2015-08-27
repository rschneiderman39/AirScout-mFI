"use strict";

app.factory('channelGraphState', ['setupService', function(setupService) {

  var service = {};

  setupService.ready.then(function() {

    var band = undefined,
        sliderExtent = undefined;

    service.band = function(newBand) {
      if (newBand === undefined) {
        return band;
      } else if (newBand === '2_4' || newBand === '5') {
        band = newBand;
      }
    };

    service.sliderExtent = function(newExtent) {
      if (newExtent === undefined) {
        return sliderExtent
      } else if (newExtent instanceof Array && newExtent.length === 2) {
        sliderExtent = newExtent;
      }
    };
  });

  return service;
}]);
