"use strict";

/* Stores the selected band and slider location for the access point count
   view.  This allows is to construct the view the way the user left it,
   instead of always starting in the same default state on view load. */
app.factory('channelGraphState', ['setupSequence', function(setupSequence) {

  var service = {};

  setupSequence.done.then(function() {

    var band = undefined,
        sliderExtent = undefined;

    /* Hybrid getter/setter for the selected band */
    service.band = function(newBand) {
      if (newBand === undefined) {
        return band;
      } else if (newBand === '2_4' || newBand === '5') {
        band = newBand;
      }
    };

    /* Hybrid getter/setter for the slider extent */
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
