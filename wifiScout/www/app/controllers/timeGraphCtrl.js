"use strict";

app.controller('timeGraphCtrl', ['$scope', '$timeout', 'globalSettings', 'timeGraphManager',
  'visBuilder', 'setupService', function($scope, $timeout, globalSettings, timeGraphManager,
  visBuilder, setupService) {

    setupService.ready.then(function() {

      var prefs = {
        domain: timeGraphManager.getDomain(),
        range: [globalSettings.minSignal(), globalSettings.maxSignal()],
        lineWidth: 2,
        highlightedLineWidth: 6,
        highlightOpacity: 0.3,
        widthFactor: 1,
        heightFactor: 0.92
      };

      var updateInterval = timeGraphManager.getUpdateInterval();

      $scope.strings = globals.strings;
      $scope.legendData = undefined;
      $scope.isDuplicateSSID = {};
      $scope.selectedSsid = null;
      $scope.selectedMac = null;

      $scope.toggleSelected = function(legendItem) {
        if (legendItem.mac === $scope.selectedMac) {
          $scope.selectedMac = null;
          $scope.selectedSsid = null;
        } else {
          $scope.selectedMac = legendItem.mac;
          $scope.selectedSsid = legendItem.ssid;
        }

        timeGraphManager.toggleHighlight(legendItem.mac);
      };

      $scope.isSelected = function(legendItem) {
        return legendItem.mac === $scope.selectedMac;
      };

      function init() {
        var config = {
          graphDomain: prefs.domain,
          graphMargins: {
            top: 10,
            bottom: 30,
            left: 50,
            right: 10
          },
          gridLineOpacity: 0.5,
          height: undefined,
          labelX: globals.strings.timeGraph.labelX,
          labelY: globals.strings.timeGraph.labelY,
          navPercent: 0,
          range: prefs.range,
          width: undefined,
          xAxisTickInterval: 10,
          yAxisTickInterval: 10
        };

        var mysteriousPixelOffset = 30;

        config.width = $('#time-graph').width() + mysteriousPixelOffset;
        config.height = ($(window).height() - $('#top-bar').height()) * prefs.heightFactor;

        var vis = visBuilder.buildVis(config, elementUpdateFn, null,
          null, null, null);

        restoreState();

        document.addEventListener(events.newTimeGraphData, vis.update);
        document.addEventListener(events.newLegendData, updateLegend);

        $scope.$on('$destroy', function() {
          document.removeEventListener(events.newTimeGraphData, vis.update);
          document.removeEventListener(events.newLegendData, updateLegend);

          d3.select('#vis').selectAll('*').remove();
        });

      };

      function restoreState() {
        $scope.legendData = timeGraphManager.getLegendData();
        $scope.selectedSsid = timeGraphManager.getHighlightedSsid();
        $scope.selectedMac = timeGraphManager.getHighlightedMac();

        updateDuplicateSsids();
      };

      function updateDuplicateSsids() {
        var found = {},
            duplicates = {};

        $.each($scope.legendData, function(i, legendItem) {
          if (found[legendItem.ssid]) {
            duplicates[legendItem.ssid] = true;
          } else {
            found[legendItem.ssid] = true;
          }
        });

        $scope.isDuplicateSSID = duplicates;
      };

      function updateLegend() {
        $timeout(function() {
          $scope.legendData = timeGraphManager.getLegendData();
          $scope.selectedSsid = timeGraphManager.getHighlightedSsid();
          $scope.selectedMac = timeGraphManager.getHighlightedMac();

          updateDuplicateSsids();
        });
      };

      function elementUpdateFn(graphClip, graphScalesX, graphScalesY) {
        var lineGenerator = d3.svg.line()
          .x(function(d, i) {
            return graphScalesX(graphScalesX.domain()[0] + (i-2) * (updateInterval / 1000));
          })
          .y(function(d, i) {
            return graphScalesY(d.level);
          })
          .interpolate('linear');

        var datasets = timeGraphManager.getSelectedDatasets();

        var lines = graphClip.selectAll('.data-line')
          .data(datasets, function(d, i) {
            return d.mac;
          });

        lines.interrupt();

        lines.exit()
          .remove();

        lines.enter()
          .append('path')
          .classed('data-line', true)
          .attr('stroke', function(d) { return d.color })
          .attr('stroke-width', prefs.lineWidth)
          .attr('fill', 'none');

        var translation = graphScalesX(updateInterval / 1000) - graphScalesX(0);

        lines
          .attr('fill', function(d) {
            if (d.highlight) {
              this.parentNode.appendChild(this);
              return utils.toNewAlpha(d.color, prefs.highlightOpacity);
            } else {
              return 'none';
            }
          })
          .attr('stroke-width', function(d) {
            if (d.highlight) {
              return prefs.highlightedLineWidth;
            } else {
              return prefs.lineWidth;
            }
          })
          .attr('d', function(d) {
            return lineGenerator(d.data);
          })
          .attr('transform', 'translate(' + translation + ')')
          .transition()
            .duration(updateInterval)
            .ease('linear')
            .attr('transform', 'translate(0)');

      };

      init();

    });

}]);
