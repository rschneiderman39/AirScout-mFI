app.controller('timeGraphCtrl', ['$scope', '$timeout', 'timeGraphManager',
  'setupService', function($scope, $timeout, timeGraphManager, setupService) {

    setupService.ready.then(function() {

      var config = {
        margins: {
          left: 40,
          right: 0,
          top: 30,
          bottom: 40
        },
        range: [constants.signalFloor, constants.maxSignal]
      };

      var graph = (function() {
        var graph = {};

        /* Namespaces for plot elements, scales, and dimensions. */
        var elem = {}, scales = {}, dim = {};

        var lineGenerator;

        graph.init = function() {
          /* Scale to device screen */
          dim.totalWidth = $('#graph').width() * 0.95;
          dim.totalHeight = ($(window).height() - $('#top-bar').height()) * 0.95;

          build();
        };

        graph.update = function(datasets) {
          console.log(JSON.stringify(datasets[0].dataset));

          var lines = elem.clip.selectAll('path')
            .data(datasets, function(d) {
              return d.MAC
            });

          lines.interrupt();

          lines.enter()
            .append('path')
            .attr('fill', 'none')
            .attr('stroke', function(d) { return d.color })
            .attr('stroke-width', 1);

          lines
            .attr('d', function(d) { return lineGenerator(d.dataset) });

          lines.exit()
            .remove();

          var translation = scales.x(updateInterval / 1000) - scales.x(0);

          lines
            .attr('transform', 'translate(' + translation + ')')
            .transition()
              .duration(updateInterval)
              .ease('linear')
              .attr('transform', 'translate(0)');
        };

        /* Derive graph dimensions and add elements to DOM */
        var build = function() {
          /* Dimensions */
          dim.margins = config.margins;

          dim.width = dim.totalWidth - dim.margins.left - dim.margins.right;
          dim.height = dim.totalHeight - dim.margins.top - dim.margins.bottom;

          /* Container */
          elem.container = d3.select('#graph').append('svg')
            .attr('width', dim.totalWidth)
            .attr('height', dim.totalHeight)
            .append('g')
              .attr('transform', 'translate(' + dim.margins.left + ',' + dim.margins.top + ')');

          /* Clip-path */
          elem.clip = elem.container.append('g')
            .attr('clip-path', 'url(#graph-clip)')

          elem.clip.append('svg:clipPath')
            .attr('id', 'graph-clip')
            .append('rect')
              .attr('width', dim.width)
              .attr('height', dim.height);

          elem.axis = {};

          /* X Axis */
          scales.x = d3.scale.linear()
            .domain(domain)
            .range([0, dim.width]);

          elem.axis.x = d3.svg.axis()
            .scale(scales.x)
            .orient('bottom')
            .ticks(utils.spanLen(scales.x))
            .tickSize(1);

          elem.container.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + dim.height + ')')
            .call(elem.axis.x);

          /* X Label */
          elem.container.append('text')
            .text(strings.timeGraph.labelX)
            .attr('x', function() {
              return (dim.width / 2) - (this.getBBox().width / 2);
            })
            .attr('y', dim.height + dim.margins.bottom - 1);

          /* Y Axis */
          scales.y = d3.scale.linear()
            .domain(config.range)
            .range([dim.height, 0]);

          elem.axis.y = d3.svg.axis()
            .scale(scales.y)
            .orient('left')
            .ticks(8)
            .tickSize(1);

          elem.container.append('g')
            .attr('class', 'y axis')
            .call(elem.axis.y);

          /* Y Label */
          elem.container.append('text')
            .text(strings.timeGraph.labelY)
            .attr('transform', function() {
              return 'rotate(90) translate(' + dim.height/2 + ', ' + this.getBBox().width/2 + ')';
            });

          lineGenerator = d3.svg.line()
            .x(function(d, i) {
              return scales.x(domain[0] + (i-1) * (updateInterval / 1000));
            })
            .y(function(d, i) {
              return scales.y(d.level);
            })
            .interpolate('linear');

        };

        return graph;
      })();

      var updateGraph = function() {
        graph.update(timeGraphManager.getSelectedDatasets());
      };

      var updateLegend = function() {

      };

      var init = function() {
        graph.init();

        document.addEventListener(events.newTimeGraphData, updateGraph);
      }

      init();

    });

}]);
