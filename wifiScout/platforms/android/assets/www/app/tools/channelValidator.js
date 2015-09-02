"use strict";

app.factory('channelValidator', ['globals', 'setupSequence', function(globals,
setupSequence) {

  var service = {};

  setupSequence.done.then(function() {

    var isAllowableChannel = {};

    service.isAllowableChannel = function(channel) {
      return isAllowableChannel[channel];
    };

    function init() {
      isAllowableChannel = channels[globals.region] || channels[globals.defaults.region];
    };

    init();

  });

  return service;

}]);
