app.factory('channelTableDataService', ['APService', 'filterSettingsService',
  'utilService', function(APService, filterSettingsService, utilService) {
    var service = {};

    service.generateData = function(band) {
      var APData = APService.getNamedAPData(),
          data = [];

      for (var i = 0; i < APData.length; ++i) {
        if (showAll || isSelected[APData[i].BSSID]) {
          if (band === '2_4Ghz') {
            if (APData[i].frequency >= 2412 && APData[i].frequency <= 2484) {
              data.push(APData[i]);
            }
          } else if (band === '5Ghz') {
            if (APData[i].frequency >= 5035 && APData[i].frequency <= 5825) {
              data.push(APData[i]);
            }
          }
        }
      }

      return data;
    };

    var isSelected = {},
        showAll = true;

    return service;
  }])
