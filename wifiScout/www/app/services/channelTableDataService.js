app.factory('channelTableDataService', ['APService', 'filterSettingsService',
  'utilService', function(APService, filterSettingsService, utilService) {
    var service = {};

    service.generateData = function() {
      var APData = APService.getNamedAPData(),
          data = [];

      for (var i = 0; i < APData.length; ++i) {
        if (showAll || isSelected[APData[i].BSSID]) {
          data.push(APData[i]);
        }
      }

      return data;
    };

    var isSelected = {},
        showAll = true;

    return service;
  }])
