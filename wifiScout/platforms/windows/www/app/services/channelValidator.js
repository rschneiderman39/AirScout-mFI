"use strict";

app.factory('channelValidator', ['setupService', function(setupService) {

  var service = {};

  setupService.ready.then(function() {

    var isAllowableChannel = {};

    service.isAllowableChannel = function(channel) {
      return isAllowableChannel[channel];
    };

    function init() {
      isAllowableChannel = channels[globals.region] || channels[defaults.region];
    };

    init();

  });

  return service;

}]);
