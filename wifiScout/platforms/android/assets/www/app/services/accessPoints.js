"use strict";

app.factory('accessPoints', ['globalSettings', 'setupService', function(
  globalSettings, setupService) {

    var service = {};

    setupService.ready.then(function() {

      var accessPointColors = {},
          accessPointCount = 0;

      function AccessPoint(scanResult) {
        var randColor;

        this.SSID = scanResult.SSID || strings.hiddenSSID;

        this.MAC = scanResult.BSSID;

        this.capabilities = scanResult.capabilities;

        this.level = scanResult.level;

        this.frequency = scanResult.frequency;

        this.channel = utils.freqToChannel(this.frequency);

        this.manufacturer = utils.getManufacturer(this.MAC);

        if (accessPointColors[this.MAC]) {
          this.color = accessPointColors[this.MAC];

        } else {
          randColor = utils.getRandomColor();
          this.color = randColor;
          accessPointColors[this.MAC] = randColor;
        }

        return this;
      };

      service.count = function() {
        return accessPointCount;
      };

      service.get = function(macAddr) {
        var defer = $.Deferred();

        service.getAll().done(function(accessPoints) {

          $.each(accessPoints, function(i, accessPoint) {
            if (accessPoint.MAC === macAddr) {
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

    });

    return service;
}]);
