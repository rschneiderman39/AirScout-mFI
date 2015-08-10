app.factory('channelGraphManager', ['accessPoints', 'globalSettings',
'setupService', function(accessPoints, globalSettings, setupService) {

  var service = {};

  setupService.ready.then(function() {

    var isSelected = {},
        showAll = true,
        band = undefined,
        viewportExtent = undefined;

    var inBand = utils.inBand;

    service.getData = function(band) {
      var allAccessPoints = accessPoints.getAll(),
          data = [],
          accessPoint;

      for (var i = 0; i < allAccessPoints.length; ++i) {
        accessPoint = allAccessPoints[i];
        if (showAll || isSelected[accessPoint.BSSID]) {
          if (inBand(accessPoint.frequency, band)) {
            data.push(accessPoint);
          }
        }
      }

      return data;
    };

    service.getTransitionInterval = function() {
      return accessPoints.getUpdateInterval() * 0.8;
    }

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

    var updateSelection = function() {
      var selection = globalSettings.getAccessPointSelection('channelGraph');

      isSelected = {};

      for (var i = 0; i < selection.selectedBSSIDs.length; ++i) {
        isSelected[selection.selectedBSSIDs[i]] = true;
      }

      showAll = selection.showAll;
    };

    var init = function() {
      var selection = globalSettings.getAccessPointSelection('channelGraph');

      for (var i = 0; i < selection.selectedBSSIDs.length; ++i) {
        isSelected[selection.selectedBSSIDs[i]] = true;
      }

      showAll = selection.showAll;

      document.addEventListener(events.newAccessPointSelection['channelGraph'], updateSelection);
    };

    init();

  });

  return service;

}]);
