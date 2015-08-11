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

        this.level = scanResult.level;

        this.frequency = scanResult.frequency;

        this.channel = utils.freqToChannel(this.frequency);

        //this.manufacturer = utils.macToManufacturer(this.MAC);

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
          for (var i = 0; i < accessPoints.length; ++i) {
            if (accessPoints[i].MAC === macAddr) {
              defer.resolve(accessPoints[i]);
            }
          }
        });

        return defer;
      };

      service.getAll = function() {
        var defer = $.Deferred();

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

    return service;
}]);
