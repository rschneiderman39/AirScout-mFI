app.controller('timeGraphCtrl', ['$scope', '$timeout', 'timeGraphManager',
  'visBuilder', 'setupService', function($scope, $timeout, timeGraphManager,
  visBuilder, setupService) {

    setupService.ready.then(function() {

      var prefs = {
        domain: timeGraphManager.getDomain(),
        range: [constants.noSignal, constants.maxSignal],
        lineWidth: 2,
        highlightOpacity: 0.3
      };

      var selectedMacAddr = "";

      var updateInterval = timeGraphManager.getUpdateInterval(),
          domain = timeGraphManager.getDomain();

      $scope.strings = strings;
      $scope.legendData = undefined;
      $scope.isDuplicateSSID = {};

      $scope.toggleSelected = function(macAddr) {
        if (typeof macAddr === 'string') {
          if (macAddr === selectedMacAddr) {
            selectedMacAddr = "";
          } else {
            selectedMacAddr = macAddr;
          }
          graph.toggleHighlight(macAddr);
        }
      };

      $scope.isSelected = function(macAddr) {
        return macAddr === selectedMacAddr;
      };

      function init() {
        var config = {
          graphDomain: prefs.domain,
          graphMargins: {
            top: 30,
            bottom: 40,
            left: 40,
            right: 10
          },
          gridLineOpacity: 0.5,
          height: undefined,
          labelX: strings.timeGraph.labelX,
          labelY: strings.timeGraph.labelY,
          navPercent: 0,
          range: prefs.range,
          width: undefined,
          xAxisTickInterval: 10,
          yAxisTickInterval: 10
        };

        config.width = $('#time-graph').width() * 0.95;
        config.height = ($(window).height() - $('#top-bar').height()) * 0.95;

        var vis = visBuilder.buildVis(config, elementUpdateFn, null,
          null, null, null);

        document.addEventListener(events.newTimeGraphData, vis.update);

        $scope.$on('$destroy', function() {
          document.removeEventListener(events.newTimeGraphData, vis.update);

          d3.select('#vis').selectAll('*').remove();
        });

      };

      function elementUpdateFn(graphClip, graphScalesX, graphScalesY, _, _) {
        var lineGenerator = d3.svg.line()
          .x(function(d, i) {
            return graphScalesX(domain[0] + (i-2) * (updateInterval / 1000));
          })
          .y(function(d, i) {
            return graphScalesY(d.level);
          })
          .interpolate('linear');

        var datasets = timeGraphManager.getSelectedDatasets();

        var lines = graphClip.selectAll('.data-line')
          .data(datasets, function(d, i) {
            return d.MAC;
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
              return utils.toNewAlpha(d.color, prefs.highlightOpacity);
            } else {
              return 'none';
            }
          })
          .attr('d', function(d) {
            return lineGenerator(d.dataset);
          })
          .attr('transform', 'translate(' + translation + ')')
          .transition()
            .duration(updateInterval)
            .ease('linear')
            .attr('transform', 'translate(0)');

      }

      init();

    });

}]);
