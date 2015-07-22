app.factory('channelGraphDataService', ['APService', 'filterSettingsService',
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

    service.getBand = function() {
      return band;
    };

    service.getXDomain = function(band) {
      return xDomain[band];
    };

    service.getYDomain = function() {
      return yDomain;
    };

    service.getWindowExtent5Ghz = function() {
      return windowExtent5Ghz;
    };

    service.setBand = function(newBand) {
      if (newBand === '2_4Ghz' || newBand === '5Ghz') {
        band = newBand;
      }
    };

    service.setWindowExtent5Ghz = function(extent) {
      if (extent instanceof Array && extent.length === 2) {
        windowExtent5Ghz = extent.slice();
      }
    };

    var isSelected = {},
        showAll = true,
        band = '2_4Ghz',
        xDomain = {
          '2_4Ghz': [-1, 15],
          '5Ghz': [34, 167]
        },
        yDomain = [-100, -30],
        windowExtent5Ghz = [34, 66];

    var onFilterSettingsChange = function(settings) {
      isSelected = {};
      for (var i = 0; i < settings.selectedBSSIDs.length; ++i) {
        isSelected[settings.selectedBSSIDs[i]] = true;
      }
      showAll = settings.showAll;
      filterSettingsService.requestSettings('channelGraph').done(onFilterSettingsChange);
    };

    var settings = filterSettingsService.getSettings('channelGraph');
    for (var i = 0; i < settings.selectedBSSIDs.length; ++i) {
      isSelected[settings.selectedBSSIDs[i]] = true;
    }
    showAll = settings.showAll;
    filterSettingsService.requestSettings('channelGraph').done(onFilterSettingsChange);

    return service;
  }]);
