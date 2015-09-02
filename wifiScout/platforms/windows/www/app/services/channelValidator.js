"use strict";

app.factory('channelValidator', ['setupSequence', function(setupSequence) {

  var service = {};

  setupSequence.done.then(function() {

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
