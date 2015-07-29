app.factory('channelGraphState', ['accessPoints', 'globalSettings', 'utils',
'cordovaService', function(accessPoints, globalSettings, utils, cordovaService) {
  var service = {};
  cordovaService.ready.then(function() {
    service.getData = function() {
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
        band = '2_4Ghz',
        domain = {
          '2_4Ghz': [-1, 15],
          '5Ghz': [34, 167]
        },
        range = [-100, -30],
        sliderExtent = [34, 66];

    var updateSelection = function(settings) {
      isSelected = {};
      for (var i = 0; i < settings.selectedBSSIDs.length; ++i) {
        isSelected[settings.selectedBSSIDs[i]] = true;
      }
      showAll = settings.showAll;

      globalSettings.awaitNewSelection('channelGraph').done(updateSelection);
    };

    var init = function() {
      var selection = globalSettings.getSelection('channelGraph');

      for (var i = 0; i < selection.selectedBSSIDs.length; ++i) {
        isSelected[selection.selectedBSSIDs[i]] = true;
      }
      showAll = selection.showAll;
      globalSettings.awaitNewSelection('channelGraph').done(updateSelection);
    };

    init();

  });

  return service;

}]);