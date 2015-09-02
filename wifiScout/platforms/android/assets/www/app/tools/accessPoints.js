"use strict";

app.factory('accessPoints', ['utils', 'globals', 'globalSettings', 'setupSequence',
function(utils, globals, globalSettings, setupSequence) {

    var service = {};

    setupSequence.done.then(function() {

      var accessPointColors = {},
          accessPointCount = 0;

      service.count = function() {
        return accessPointCount;
      };

      service.get = function(macAddr) {
        var defer = $.Deferred();

        service.getAll().done(function(accessPoints) {

          $.each(accessPoints, function(i, accessPoint) {
            if (accessPoint.mac === macAddr) {
              defer.resolve(accessPoint);
            }
          });

          defer.resolve(null);
        });

        return defer;
      };

      service.getAll = function() {
        var defer = $.Deferred();

        window.plugins.WifiAdmin.scan();

        window.plugins.WifiAdmin.getWifiInfo(
          function success(info) {
            var accessPoints = [];

            accessPointCount = 0;

            $.each(info.available, function(i, scanResult) {
              if (globalSettings.detectHidden() || scanResult.SSID !== "") {
                accessPoints.push(new AccessPoint(scanResult));
                ++accessPointCount;
              }
            });

            defer.resolve(accessPoints);
          },
          function failure() {
            console.log("Failed to collect access point data.");
            defer.resolve([]);
          }
        );

        return defer;
      };

      function AccessPoint(scanResult) {
        var randColor;

        if (scanResult.SSID === "") {
          this.ssid = globals.strings.hiddenSSID;
          this.hidden = true;
        } else {
          this.ssid = scanResult.SSID;
          this.hidden = false;
        }

        this.mac = scanResult.BSSID;
        this.capabilities = scanResult.capabilities;
        this.level = scanResult.level;
        this.frequency = scanResult.frequency;
        this.channel = utils.freqToChannel(this.frequency);
        this.manufacturer = utils.macToManufacturer(this.mac);

        if (accessPointColors[this.mac]) {
          this.color = accessPointColors[this.mac];

        } else {
          randColor = utils.getRandomColor();
          this.color = randColor;
          accessPointColors[this.mac] = randColor;
        }

        return this;
      };

    });

    return service;
}]);
