/* Maintains current data about every AP the device can see. Each view
   should use this service whenever it wants to update its local data */
app.factory('accessPoints', ['$rootScope', '$state', 'networkData', 'globalSettings', 'setupService',
function($rootScope, $state, networkData, globalSettings, setupService) {

  var service = {};

  setupService.ready.then(function() {

    var updateInterval = constants.updateIntervalNormal;

    var accessPoints = [],
        lineColors = {};

    var inBand = utils.inBand,
        freqToChannel = utils.freqToChannel,
        getRandomColor = utils.getRandomColor;

    service.getAll = function() {
      return accessPoints;
    };

    service.getAllInBand = function(band) {
      var accessPointsInBand = [];

      for (var i = 0; i < accessPoints.length; ++i) {
        if (inBand(accessPoints[i], band)) {
          accessPointsInBand.push(accessPoints[i]);
        }
      }

      return accessPointInBand;
    }

    service.getSelected = function(BSSIDs) {
      var selectedAccessPoints = [],
          isSelected = {};
      for (var i = 0; i < BSSIDs.length; ++i) {
        isSelected[BSSIDs[i]] = true;
      }
      if (BSSIDs.length > 0) {
        for (var i = 0; i < accessPoints.length; ++i) {
          if (isSelected[accessPoints[i].BSSID] === true) {
            selectedAccessPoints.push(accessPoints[i]);
          }
        }
      }
      return selectedAccessPoints;
    };

    service.getUpdateInterval = function() {
      return updateInterval;
    }

    service.count = function() {
      return accessPoints.length;
    }

    service.get = function(BSSID) {
      if (BSSID !== "") {
        for (var i = 0; i < accessPoints.length; ++i) {
          if (accessPoints[i].BSSID === BSSID) {
            return accessPoints[i];
          }
        }
      }
      return null;
    };

    var markHidden = function(data) {
      for (var i = 0; i < data.length; ++i) {
        if (data[i].SSID === "") {
          data[i].SSID = "<hidden>";
        }
      }
      return data;
    };

    var removeHidden = function(data) {
      return data.filter(function(ap) {
        return ap.SSID !== "";
      });
    };

    var appendChannels = function(data) {
      for (var i = 0; i < data.length; ++i) {
        data[i].channel = freqToChannel(data[i].frequency);
      }
      return data;
    };

    var appendColors = function(data) {
      for (var i = 0; i < data.length; ++i) {
        var lineColor = lineColors[data[i].BSSID];
        if (lineColor === undefined) {
          lineColor = getRandomColor();
          lineColors[data[i].BSSID] = lineColor;
        }
        data[i].color = lineColor;
      }
      return data;
    };

    var getNextUpdateInterval = function(toState) {

      if (toState.name === 'channelGraph') {
        if (accessPoints.length < constants.moderateAPCountThresh) {
          return constants.updateIntervalFast;
        } else if (accessPoints.length < constants.highAPCountThresh) {
          return constants.updateIntervalNormal;
        } else {
          return constants.updateIntervalSlow;
        }

      } else if (toState.name === 'signalStrength') {
        return constants.updateIntervalFast;

      } else if (toState.name === 'timeGraph') {
        return constants.updateIntervalNormal;

      } else if (toState.name === 'APTable') {
        if (accessPoints.length < constants.highAPCountThresh) {
          return constants.updateIntervalNormal;
        } else {
          return constants.updateIntervalSlow;
        }

      } else if (toState.name === 'channelTable') {
        return constants.updateIntervalNormal;

      } else {
        return constants.updateIntervalNormal;
      }
    };

    /* Get data from the device and update internal state accordingly */
    var update = function() {
      if (! globalSettings.updatesPaused()) {
        networkData.get()
        .done(function(data) {
          if (globalSettings.detectHidden()) {
            accessPoints = appendColors(appendChannels(markHidden(data.available)));
          } else {
            accessPoints = appendColors(appendChannels(removeHidden(data.available)));
          }
        })
        .fail(function() {
          accessPoints = [];
        });

        document.dispatchEvent(new Event(events.newAccessPointData));
      }

      console.log('updateInerval');
      setTimeout(update, updateInterval);
    };

    var init = function() {
      $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams) {
          updateInterval = getNextUpdateInterval(toState);
        });

      update();
    };

    init();

  });

  return service;

}]);
