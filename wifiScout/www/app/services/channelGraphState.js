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

    service.viewportExtent = function(newExtent) {
      if (newExtent === undefined) {
        return viewportExtent
      } else if (newExtent instanceof Array && newExtent.length === 2) {
        viewportExtent = newExtent;
      }
    };

    var isSelected = {},
        showAll = true,
        band = undefined,
        viewportExtent = undefined;

    var updateSelection = function(selection) {
      isSelected = {};
      for (var i = 0; i < selection.selectedBSSIDs.length; ++i) {
        isSelected[selection.selectedBSSIDs[i]] = true;
      }
      showAll = selection.showAll;

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
