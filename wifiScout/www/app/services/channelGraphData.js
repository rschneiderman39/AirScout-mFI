app.factory('channelGraphData', ['accessPoints', 'filterSettings', 'globalSettings',
  'utils', function(accessPoints, filterSettings, globalSettings, utils) {
    var service = {};

    service.generate = function() {
      var APData = accessPoints.getAll(),
          data = [];

      for (var i = 0; i < APData.length; ++i) {
        if (showAll || isSelected[APData[i].BSSID]) {
          data.push(APData[i]);
        }
      }

      return data;
    };

    service.band = function(newBand) {
      if (newBand === undefined) {
        return band;
      } else if (newBand === '2_4Ghz' || newBand === '5Ghz') {
        band = newBand;
      }
    };

    service.sliderExtent = function(newExtent) {
      if (newExtent === undefined) {
        return sliderExtent
      } else if (newExtent instanceof Array && newExtent.length === 2) {
        sliderExtent = newExtent;
      }
    };

    service.getDomain = function(band) {
      return domain[band];
    };

    service.getRange = function() {
      return range;
    };

    var isSelected = {},
        showAll = true,
        filterSettingsTarget = 'channelGraph',
        band = '2_4Ghz',
        domain = {
          '2_4Ghz': [-1, 15],
          '5Ghz': [34, 167]
        },
        range = [-100, -30],
        sliderExtent = [34, 66];

    var updateFilterSettings = function(settings) {
      isSelected = {};
      for (var i = 0; i < settings.selectedBSSIDs.length; ++i) {
        isSelected[settings.selectedBSSIDs[i]] = true;
      }
      showAll = settings.showAll;
      filterSettings.await(filterSettingsTarget).done(updateFilterSettings);
    };

    if (globalSettings.globalFilter()) {
      filterSettingsTarget = 'global';
    }

    var settings = filterSettings.get(filterSettingsTarget);
    for (var i = 0; i < settings.selectedBSSIDs.length; ++i) {
      isSelected[settings.selectedBSSIDs[i]] = true;
    }
    showAll = settings.showAll;
    filterSettings.await(filterSettingsTarget).done(updateFilterSettings);

    return service;
  }]);
