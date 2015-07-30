angApp.factory('channels', ['setupService', function(setupService) {

  var service = {};

  setupService.ready.then(function() {
    var freqChannelMap = {},
        isChannel = {};

    service.freqToChannel = function(freq) {
      return freqChannelMap[freq];
    };

    service.isChannel = function(channel) {
      return isChannel[channel];
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
