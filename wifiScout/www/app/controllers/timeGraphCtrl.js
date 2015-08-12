app.controller('timeGraphCtrl', ['$scope', '$timeout', 'timeGraphManager',
  'setupService', function($scope, $timeout, timeGraphManager, setupService) {

    setupService.ready.then(function() {

      var config = {
        margins: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        },
        domain: [-60, 0],
        range: [-100, -30]
      };

      var selectedMacAddr = "";

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

      var graph = (function() {
        var graph = {};

        /* Namespaces for plot elements, scales, and dimensions. */
        var elem = {}, scales = {}, dim = {};

        graph.init = function() {
          /* Scale to device screen */
          dim.totalWidth = $('#graph').width() * 0.95;
          dim.totalHeight = ($(window).height() - $('#top-bar').height()) * 0.95;

          build();
        };

        graph.update = function(datasets) {

        };

        graph.toggleHighlight = function(macAddr) {

        };

        graph.destroy = function() {

        };

        /* Derive graph dimensions and add elements to DOM */
        var build = function() {
          /* Dimensions */
          dim.margins = config.margins;

          dim.width = dim.totalWidth - dim.margins.left - dim.margins.right;
          dim.height = dim.totalHeight - dim.margins.top - dim.margins.bottom;

          /* Container */
          elem.container = d3.select('#graph').append('svg')
            .attr('width', dim.width)
            .attr('height', dim.height)
            .append('g')
              .attr('transform', 'translate(' + dim.margins.left + ',' + dim.margins.top + ')');

          /* Clip-path */
          elem.clip = elem.container.append('g')
            .attr('clip-path', 'url(#graph-clip)')

          elem.clip.append('svg:clipPath')
            .attr('id', 'graph-clip')
            .append('rect')
              .attr({ width: dim.width, height: dim.height });

          elem.axis = {};

          /* X Axis */
          scales.x = d3.scale.linear()
            .domain(config.domain2_4)
            .range([0, dim.width]);

          elem.axis.x = d3.svg.axis()
            .scale(scales.x)
            .orient('bottom')
            .ticks(spanLen(scales.x))
            .tickSize(1);

          elem.container.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + dim.height + ')')
            .call(elem.axis.x);

          /* X Label */
          elem.container.append('text')
            .text(strings.channelGraph.labelX)
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
            .text(strings.channelGraph.labelY)
            .attr('transform', function() {
              return 'rotate(90) translate(' + dim.height/2 + ', ' + this.getBBox().width/2 + ')';
            });
        };

        return graph;
      })();
    });

    var updateGraph = function() {
      graph.update(timeGraphManager.getDatasets());
    };

    var updateLegend = function() {

    };

    var init = function() {
      graph.init();

      document.addEventListener(events.newTimeGraphData, updateGraph);
    }

  }])
