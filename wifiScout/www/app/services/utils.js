/* Contains some utility functions for performing transformations on
   signal strength values.  For now, only needed for the gauge.
*/
app.factory('utils', ['cordovaService', function(cordovaService) {

  var service = {};

  cordovaService.ready.then(function() {
    var freqChannelMap = {},
        isChannel = {};

    service.spanLen = function(span) {
      return span[1] - span[0];
    };

    service.freqToChannel = function(freq) {
      return freqChannelMap[freq];
    };

    service.isChannel = function(channel) {
      return isChannel[channel];
    }

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

    service.destroy = function(obj) {
      for (var key in obj) {
        if (isNaN(parseInt(key))) destroy(obj[key]);
      }
      delete obj;
    };

    service.hiddenSSIDSort = function(AP) {
      if (AP.SSID.charAt(0) === '<') {
        return "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz";
      } else {
        return AP.SSID;
      }
    };

    var init = function() {
      for (var i = 1; i <= 14; ++i) {
        freqChannelMap[2407 + 5*i] = i;
      }
      for (var i = 36; i <= 64; i += 4) {
        freqChannelMap[5000 + 5*i] = i;
      }
      for (var i = 100; i <= 140; i += 4) {
        freqChannelMap[5000 + 5*i] = i;
      }
      for (var i = 149; i <= 165; i += 4) {
        freqChannelMap[5000 + 5*i] = i;
      }

      for (var freq in freqChannelMap) {
        isChannel[freqChannelMap[freq]] = true;
      }
    };

    init();

  });

  return service;

}]);
