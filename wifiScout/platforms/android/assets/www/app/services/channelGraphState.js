app.factory('channelGraphState', ['accessPoints', 'globalSettings',
'setupService', function(accessPoints, globalSettings, setupService) {

  var service = {};

  setupService.ready.then(function() {
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
      } else if (newBand === '2_4' || newBand === '5') {
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

    var isSelected = {},
        showAll = true,
        band = undefined,
        sliderExtent = undefined;

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
