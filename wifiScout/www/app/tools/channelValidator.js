"use strict";

app.factory('channelValidator', ['globals', 'setupSequence', function(globals,
setupSequence) {

  var service = {};

  setupSequence.done.then(function() {

    var isAllowableChannel = channels[globals.region] || 
                             channels[globals.defaults.region];

    service.isAllowableChannel = function(channel) {
      return isAllowableChannel[channel];
    };

  });

  return service;

}]);
