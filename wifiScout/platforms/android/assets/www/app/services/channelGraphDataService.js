app.factory('channelGraphDataService', ['APService', 'utilService',
  function(APService, utilService) {
  var service = {};

  service.generateDatasets = function() {
    var APData = APService.getNamedAPData(),
        datasets = [];

    for (var i = 0; i < APData.length; ++i) {
      var AP = APData[i];

      if (showAll || isSelected[AP.BSSID]) {
        var lineColor = lineColors[AP.BSSID];
        if (lineColor === undefined) {
          lineColor = utilService.getRandomColor();
          lineColors[AP.BSSID] = lineColor;
        };

        datasets.push(
          {
            label: AP.SSID,
            color: lineColor,
            data: generateParabola(AP.channel, AP.level),
            showLabels: true,
            labels: ["", "", "", AP.SSID, "", "", ""],
            labelPlacement: "above",
            labelClass: "parabolaLabel",
            labelColor: lineColor
          }
        );
      }
    }
    return datasets;
  };

  var lineColors = {};
      isSelected = {},
      showAll = true;

  var generateParabola = function(channel, level) {
    return [
      [channel - 2, -100],
      [channel - 1, -100 + (level + 100) * 0.8],
      [channel - .5, -100 + (level + 100) * 0.95],
      [channel, level],
      [channel + .5, -100 + (level + 100) * 0.95],
      [channel + 1, -100 + (level + 100) * 0.8],
      [channel + 2, -100]
    ];
  };

  return service;
}]);
