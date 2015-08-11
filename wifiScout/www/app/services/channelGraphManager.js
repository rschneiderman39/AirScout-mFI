app.factory('channelGraphManager', ['accessPoints', 'globalSettings',
'setupService', function(accessPoints, globalSettings, setupService) {

  var service = {};

  setupService.ready.then(function() {

    var selectedMACs = [],
        showAll = true,
        band = undefined,
        viewportExtent = undefined;

    var inBand = utils.inBand;

    service.getData = function(band) {
      var defer = $.Deferred();

      accessPoints.getAllInBand(band).done(function(results) {
        if (showAll) {
          defer.resolve(results);

        } else {
          defer.resolve(utils.accessPointSubset(results, selectedMACs));
        }
      });

      return defer;
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

    var updateSelection = function() {
      var selection = globalSettings.getAccessPointSelection('channelGraph');

      selectedMACs = selection.macAddrs;

      showAll = selection.showAll;
    };

    var init = function() {
      var selection = globalSettings.getAccessPointSelection('channelGraph');

      for (var i = 0; i < selection.macAddrs.length; ++i) {
        isSelected[selection.macAddrs[i]] = true;
      }

      showAll = selection.showAll;

      document.addEventListener(events.newAccessPointSelection['channelGraph'], updateSelection);
    };

    init();

  });

  return service;

}]);
