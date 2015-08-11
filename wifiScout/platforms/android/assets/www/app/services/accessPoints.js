app.factory('accessPoints', ['globalSettings', 'setupService', function(
  globalSettings, setupService) {

    var service = {};

    setupService.ready.then(function() {

      var accessPointColors = {},
          accessPointCount = 0;

      function AccessPoint(scanResult) {
        var randColor;

        this.SSID = scanResult.SSID || "<hidden>";

        this.MAC = scanResult.BSSID;

        this.capabilities = scanResult.capabilities;

<<<<<<< HEAD
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

    var appendManufacturer = function(data) {
      for (var i = 0; i < data.length; ++i) {
        data[i].manufacturer = utils.macToManufacturer(data[i].BSSID);
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
=======
        this.level = scanResult.level;

        this.frequency = scanResult.frequency;
>>>>>>> 8b542675b5c90f9e4e2493869cbfd35ac8ff6b46

        this.channel = utils.freqToChannel(this.frequency);

        this.manufacturer = utils.getManufacturer(this.MAC);

        if (accessPointColors[this.MAC]) {
          this.color = accessPointColors[this.MAC];

        } else {
          randColor = utils.getRandomColor();
          this.color = randColor;
          accessPointColors[this.MAC] = randColor;
        }

<<<<<<< HEAD
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
            //APData = appendManufacturer(appendColors(appendChannels(markHidden(data.available))));
            accessPoints = appendColors(appendChannels(markHidden(data.available)));
          } else {
            //APData = appendManufacturer(appendColors(appendChannels(removeHidden(data.available))));
            accessPoints = appendColors(appendChannels(removeHidden(data.available)));
=======
        return this;
      };

      service.count = function() {
        return accessPointCount;
      };

      service.get = function(macAddr) {
        var defer = $.Deferred();

        service.getAll().done(function(accessPoints) {
          for (var i = 0; i < accessPoints.length; ++i) {
            if (accessPoints[i].MAC === macAddr) {
              defer.resolve(accessPoints[i]);
            }
>>>>>>> 8b542675b5c90f9e4e2493869cbfd35ac8ff6b46
          }
        });

        return defer;
      };

<<<<<<< HEAD
      setTimeout(update, updateInterval);
    };
=======
      service.getAll = function() {
        var defer = $.Deferred();
>>>>>>> 8b542675b5c90f9e4e2493869cbfd35ac8ff6b46

        window.plugins.WifiAdmin.scan();

        window.plugins.WifiAdmin.getWifiInfo(
          function success(info) {
            var accessPoints = [],
                avail = info.available;

            accessPointCount = 0;

            for (var i = 0; i < avail.length; ++i) {
              if (globalSettings.detectHidden() || avail[i].SSID !== "") {
                accessPoints.push(new AccessPoint(avail[i]));
                ++accessPointCount;
              }
            }

            console.log(accessPointCount);

            defer.resolve(accessPoints);
          },
          function failure() {
            console.log("Failed to collect access point data.");
            defer.resolve([]);
          }
        );

        return defer;
      };

      service.getAllInBand = function(band) {
        var defer = $.Deferred();

        service.getAll().done(function(accessPoints) {
          var accessPointsInBand = [];

          for (var i = 0; i < accessPoints.length; ++i) {
            if (utils.inBand(accessPoints[i].frequency, band)) {
              accessPointsInBand.push(accessPoints[i]);
            }
          }

          defer.resolve(accessPointsInBand);
        });

        return defer;
      };

    });

<<<<<<< HEAD
}]);
=======
    return service;
}]);
>>>>>>> 8b542675b5c90f9e4e2493869cbfd35ac8ff6b46
