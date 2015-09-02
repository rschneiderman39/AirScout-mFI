"use strict";

app.factory('channelGraphState', ['setupSequence', function(setupSequence) {

  var service = {};

  setupSequence.done.then(function() {

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
