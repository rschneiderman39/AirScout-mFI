"use strict";

app.controller('timeGraphCtrl', ['$scope', '$timeout', 'globalSettings', 'timeGraphManager',
  'visBuilder', 'setupSequence', function($scope, $timeout, globalSettings, timeGraphManager,
  visBuilder, setupSequence) {

    setupSequence.done.then(function() {

      var prefs = {
        domain: timeGraphManager.getDomain(),
        range: [globalSettings.visScaleMin(), globalSettings.visScaleMax()],
        lineWidth: 2,
        highlightedLineWidth: 6,
        highlightOpacity: 0.3
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
          mainDomain: prefs.domain,
          mainMargins: {
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
          yAxisTickInterval: 10,
          canvasSelector: '#vis'
        };

        orient();

        config.width = $('#time-graph').width();
        config.height = $('#time-graph').height();

        var vis = visBuilder.buildVis(elemUpdateCallback);

        vis.init(config);

        restoreState();

        $scope.$on(events.newTimeGraphData, vis.update);
        $scope.$on(events.newLegendData, updateLegend);

        $(window).on('resize', redraw);

        $scope.$on('$destroy', function() {
          $(window).off('resize', redraw);
          vis.destroy();
        });

        /* Rebuild visualization from scratch with appropriate dimensions */
        function redraw() {
          if (globals.debug) console.log('resizing time graph');

          orient();

          config.width = $('#time-graph').width();
          config.height = $('#time-graph').height();

          vis.destroy();
          vis.init(config);
        }

        function orient() {
          $('#legend .list').height($('#legend').height()
                            - $('#legend .selection-indicator').outerHeight(true)
                            - $('#legend .divider').outerHeight(true)
                            - defaults.padding);

          if ($(window).height() > $(window).width()) {
            utils.order('#time-graph-wrapper', '#time-graph', '#legend');
          } else {
            utils.order('#time-graph-wrapper', '#legend', '#time-graph');
          }
        };
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
        if (globals.debug) console.log('updating timegraph legend');

        /* Using $timeout in place of $scope.$apply to prevent possible
           angular $digest in progress errors */
        $timeout(function() {
          $scope.legendData = timeGraphManager.getLegendData();
          $scope.selectedSsid = timeGraphManager.getHighlightedSsid();
          $scope.selectedMac = timeGraphManager.getHighlightedMac();

          updateDuplicateSsids();
        });
      };

      function elemUpdateCallback(clip, xScale, yScale) {
        if (globals.debug) console.log('updating timegraph');

        var lineGenerator = d3.svg.line()
          .x(function(d, i) {
            return xScale(xScale.domain()[0] + (i-2) * (updateInterval / 1000));
          })
          .y(function(d, i) {
            return yScale(d.level);
          })
          .interpolate('linear');

        var datasets = timeGraphManager.getSelectedDatasets();

        var lines = clip.selectAll('.data-line')
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

        var translation = xScale(updateInterval / 1000) - xScale(0);

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
