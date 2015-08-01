app.factory('channels', ['setupService', function(setupService) {

  var service = {};

  setupService.ready.then(function() {
    var isAllowableChannel = {};

    service.freqToChannel = function(freq) {
      if (freq >= 2000 && freq <= 2484 ) {
        return (freq - 2407) / 5;
      } else if (freq >= 5035 && freq <= 5825) {
        return (freq - 5000) / 5;
      }
    };

    service.isAllowableChannel = function(channel) {
      return isAllowableChannel[channel];
    };

    var init = function() {
      isAllowableChannel = globals.channels[globals.locale] || globals.defaults.channels;
    };

    init();

  });

  return service;

}]);
