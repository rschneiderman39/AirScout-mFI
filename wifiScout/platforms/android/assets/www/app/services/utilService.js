/* Contains some utility functions for performing transformations on
   signal strength values.  For now, only needed for the gauge.
*/
app.factory('utilService', function() {
  var service = {},
      freqChannelMap = {};

  service.freqToChannel = function(freq) {
    return freqChannelMap[freq];
  };

  service.getRandomColor = function() {
    var r = (Math.floor(Math.random() * 256)).toString(10),
        g = (Math.floor(Math.random() * 256)).toString(10),
        b = (Math.floor(Math.random() * 256)).toString(10);

    return 'rgba(' + r + ',' + g + ',' + b + ',' + '1)';
  };

  service.setAlpha = function(color, alpha) {
    var attrs = color.split(',');
    attrs[3] = alpha.toString() + ')';
    return attrs.join(",");
  };

  var init = function() {
    /* 2 GHz band */
    for (var i = 1; i <= 13; ++i) {
      freqChannelMap[2407 + 5*i] = i;
    }
    freqChannelMap[2484] = 14;

    /* 5 GHz band */
    for (var i = 7; i <= 9; ++i) {
      freqChannelMap[5000 + 5*i] = i;
    }
    for (var i = 11; i <= 12; ++i) {
      freqChannelMap[5000 + 5*i] = i;
    }
    freqChannelMap[5080] = 16;
    for (var i = 34; i <= 48; i += 2) {
      freqChannelMap[5000 + 5*i] = i;
    }
    for (var i = 52; i <= 64; i += 4) {
      freqChannelMap[5000 + 5*i] = i;
    }
    for (var i = 100; i <= 140; i += 4) {
      freqChannelMap[5000 + 5*i] = i;
    }
    for (var i = 149; i <= 165; i += 4) {
      freqChannelMap[5000 + 5*i] = i;
    }
    for (var i = 183; i <= 185; ++i) {
      freqChannelMap[5000 + 5*i] = i;
    }
    for (var i = 187; i <= 189; ++i) {
      freqChannelMap[5000 + 5*i] = i;
    }
    freqChannelMap[4960] = 192;
    freqChannelMap[4980] = 196;
  };

  init();

  return service;
});
