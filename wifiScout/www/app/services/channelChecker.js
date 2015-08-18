"use strict";

app.factory('channelChecker', ['setupService', function(setupService) {

  var service = {};

  setupService.ready.then(function() {

    var isAllowableChannel = {};

    service.isAllowableChannel = function(channel) {
      return isAllowableChannel[channel];
    };

    function init() {
      isAllowableChannel = channels[constants.region] || channels[defaults.region];
    };

    init();

  });

  return service;

}]);
