app.controller('channelTableCtrl', ['$scope', 'channelTableState', 'channels',
'setupService', function($scope, channelTableState, channels, setupService) {

  var prefs = {
    defaultBand: '2_4',              // Band shown on first view open ('2_4' or '5')
    domain2_4: [-1, 15],             // X-scale for 2.4 Ghz band
    domain5 : [34, 167],             // X-scale for 5 Ghz band
    range : [0, 15],                 // Y-scale for occupancy
    defaultViewportExtent: [34, 66], // 5Ghz nav viewport extent on first view open
    labelPadding: 10,                // Pixels between bar top and label bottom
    labelColor: 'black',             // Style...
    barStrokeWidth: 4,
    barStrokeColor: 'MediumBlue',
    barFillColor: 'LightBlue',
    barWidth: 0.8,
    navPercent: 0.2,                 // The portion of the graphic to be occupied by the navigator pane
    navLeftPercent: 0.2,             // The portion of the navigator to be occupied by the 2.4 Ghz selector
    plotMargins: {
      top: 20,
      bottom: 20,
      left: 40,
      right: 0
    },
    navMargins: {
      top: 1,
      bottom: 18,
      left: 40,
      right: 0
    },
    transitionInterval: 1800,        // Parabola and label animation time (ms)
    updateInterval: 2000             // Time between data updates (ms)
  };

  setupService.ready.then(function() {
    $scope.strings = globals.strings;

    var band;

    var spanLen = globals.utils.spanLen,
        setAlpha = globals.utils.setAlpha,
        isChannel = channels.isChannel;

    var elem = {}, scales = {}, dim = {};

    var init = function() {
      dim.width = globals.format.window.width * 0.95;
      dim.height = (globals.format.window.height - globals.format.topBar.height) * 0.95;

      buildPlot();
      buildNav();
      $scope.setBand(channelTableState.band() || prefs.defaultBand);

      var updateLoop = setInterval(update, prefs.updateInterval)

      $scope.$on('$destroy', function() {
        clearInterval(updateLoop);
        saveState();
      });

      update();
    };

    var update = function() {
      var data = channelTableState.getData();

      rescaleVertically(data);

      updateBars('plot', data);
      updateBars('navLeft', data);
      updateBars('navRight', data);
      updateLabels(data);
    };

    var buildPlot = function() {
      dim.plot = {};

      /* Dimensions */
      dim.plot.totalHeight = dim.height * (1 - prefs.navPercent);

      dim.plot.margin = prefs.plotMargins;

      dim.plot.width = dim.width - dim.plot.margin.left - dim.plot.margin.right;
      dim.plot.height = dim.plot.totalHeight - dim.plot.margin.top - dim.plot.margin.bottom;

      elem.plot = {};

      /* Container */
      elem.plot.container = d3.select('#plot').classed('chart', true).append('svg')
        .attr('width', dim.width)
        .attr('height', dim.plot.totalHeight)
        .append('g')
          .attr('transform', 'translate(' + dim.plot.margin.left + ',' + dim.plot.margin.top + ')');

      /* Clip-path */
      elem.plot.clip = elem.plot.container.append('g')
        .attr('clip-path', 'url(#plot-clip)')

      elem.plot.clip.append('clipPath')
        .attr('id', 'plot-clip')
        .append('rect')
          .attr({ width: dim.plot.width, height: dim.plot.height });

      scales.plot = {};
      elem.plot.axis = {};

      /* X Axis */
      scales.plot.x = d3.scale.linear()
        .domain(prefs.domain2_4)
        .range([0, dim.plot.width]);

      elem.plot.axis.x = d3.svg.axis()
        .scale(scales.plot.x)
        .orient('bottom')
        .ticks(spanLen(scales.plot.x))
        .tickSize(1);

      elem.plot.container.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + dim.plot.height + ')')
        .call(elem.plot.axis.x);

      /* Y Axis */
      scales.plot.y = d3.scale.linear()
        .domain(prefs.range)
        .range([dim.plot.height, 0]);

      elem.plot.axis.y = d3.svg.axis()
        .scale(scales.plot.y)
        .orient('left')
        .ticks(8)
        .tickSize(1);

      elem.plot.container.append('g')
        .attr('class', 'y axis')
        .call(elem.plot.axis.y);
    };

    var buildNav = function() {
      dim.nav = {};

      /* Dimensions */
      dim.nav.totalHeight = dim.height * prefs.navPercent;

      dim.nav.margin = prefs.navMargins;

      dim.nav.width = dim.width - dim.nav.margin.left - dim.nav.margin.right;
      dim.nav.height = dim.nav.totalHeight - dim.nav.margin.top - dim.nav.margin.bottom;

      scales.nav = {};

      /* Y Scale */
      scales.nav.y = d3.scale.linear()
        .domain(prefs.range)
        .range([dim.nav.height, 0]);

      /* 2.4 Ghz Portion */
      dim.nav.left = {};

      /* Dimensions */
      dim.nav.left.width = dim.nav.width * prefs.navLeftPercent;
      dim.nav.left.totalWidth = dim.nav.left.width + dim.nav.margin.left;

      elem.nav = {};
      elem.nav.left = {};

      /* Container */
      elem.nav.left.container = d3.select('#navLeft').append('svg')
        .attr('width', dim.nav.left.totalWidth)
        .attr('height', dim.nav.totalHeight)
        .append('g')
          .attr('transform', 'translate(' + dim.nav.margin.left + ',' + dim.nav.margin.top + ')');

      /* Clip-path */
      elem.nav.left.clip = elem.nav.left.container.append('g')
        .attr('clip-path', 'url(#nav-clip-left)')

      elem.nav.left.clip.append('clipPath')
        .attr('id', 'nav-clip-left')
        .append('rect')
          .attr('width', dim.nav.left.width)
          .attr('height', dim.nav.height);

      scales.nav.left = {};

      /* 2.4 Ghz selector */
      elem.nav.left.clip.append('rect')
        .attr('id', 'navToggleLeft')
        .attr('width', dim.nav.left.width)
        .attr('height', dim.nav.height)

      /* X Scale */
      scales.nav.left.x = d3.scale.linear()
        .domain(prefs.domain2_4)
        .range([0, dim.nav.left.width]);

      /* 5 Ghz Portion */
      dim.nav.right = {};

      /* Dimensions */
      dim.nav.right.width = dim.nav.width * (1 - prefs.navLeftPercent);
      dim.nav.right.totalWidth = dim.nav.right.width + dim.nav.margin.right;

      elem.nav.right = {};

      /* Container */
      elem.nav.right.container = d3.select('#navRight').append('svg')
        .attr('width', dim.nav.right.totalWidth)
        .attr('height', dim.nav.totalHeight)
        .append('g')
          .classed('navigator', true)
          .attr('transform', 'translate(0, ' + dim.nav.margin.top + ')');

      elem.nav.right.clip = elem.nav.right.container.append('g')
        .attr('clip-path', 'url(#nav-clip-right)');

      elem.nav.right.clip.append('clipPath')
        .attr('id', 'nav-clip-right')
        .append('rect')
          .attr({ width: dim.nav.right.width, height: dim.nav.height });

      scales.nav.right = {};

      scales.nav.right.x = d3.scale.linear()
        .domain(prefs.domain5)
        .range([0, dim.nav.right.width]);


      /* Viewport */
      elem.nav.right.viewport = d3.svg.brush()
        .x(scales.nav.right.x)
        .extent(channelTableState.viewportExtent() || prefs.defaultViewportExtent)
        .on("brushstart", function() {
          $scope.setBand('5');
          updateViewport();
        })
        .on("brush", function() {
          $scope.setBand('5');
          updateViewport();
          rescalePlotXAxis();
          repositionPlotElements();
        })
        .on("brushend", function() {
          $scope.setBand('5');
          updateViewport();
          rescalePlotXAxis();
          repositionPlotElements();
        });

      elem.nav.right.container.append("g")
        .attr("class", "viewport")
        .call(elem.nav.right.viewport)
          .selectAll("rect")
          .attr("height", dim.nav.height);

      /* The slider the user actually sees */
      elem.nav.right.clip.append('rect')
        .attr('id', 'navToggleRight')
        .attr('width', elem.nav.right.container.select('.viewport > .extent').attr('width'))
        .attr('height', dim.nav.height)
        .attr('x', scales.nav.right.x(elem.nav.right.viewport.extent()[0]));

      /* Borders */
      elem.nav.left.container.append('rect')
        .attr('width', dim.nav.left.width - 1)
        .attr('height', dim.nav.height)
        .attr('stroke', 'black')
        .attr('stroke-width', '1')
        .attr('fill', 'transparent')
        .attr('pointer-events', 'none');

      elem.nav.right.container.append('rect')
        .attr('width', dim.nav.right.width - 1)
        .attr('height', dim.nav.height)
        .attr('stroke', 'black')
        .attr('stroke-width', '1')
        .attr('fill', 'transparent')
        .attr('pointer-events', 'none');

      /* Labels */
      elem.nav.left.container.append('text')
        .text(globals.strings.channelGraph.label2_4)
        .attr('y', dim.nav.height + dim.nav.margin.bottom);

      elem.nav.right.container.append('text')
        .text(globals.strings.channelGraph.label5)
        .attr('y', dim.nav.height + dim.nav.margin.bottom);
    };

    $scope.setBand = function(newBand) {
      if (newBand !== band) {
        if (newBand ===  '2_4') {
          elem.nav.right.clip.select('#navToggleRight').classed('active', false);
          elem.nav.left.clip.select('#navToggleLeft').classed('active', true);
        } else if (newBand === '5') {
          elem.nav.left.clip.select('#navToggleLeft').classed('active', false);
          elem.nav.right.clip.select('#navToggleRight').classed('active', true);
        }
        band = newBand;

        resetPlotXAxis();
        rescalePlotElements();
        repositionPlotElements();
      }
    };

    var barWidth = function(scale) {
      return (scale(1) - scale(0)) * prefs.barWidth;
    };

    var saveState = function() {
      channelTableState.band(band);
      channelTableState.sliderExtent(elem.nav.right.viewport.extent());
    };

    var repositionPlotElements = function() {
      /* Move parabolas */
      elem.plot.clip.selectAll('.bar')
        .attr('x', function(d) {
          return scales.plot.x(d.channel) - barWidth(scales.plot.x) / 2;
        });

      /* Move labels */
      elem.plot.clip.selectAll('text')
        .attr('x', function(d) {
          return scales.plot.x(d.channel) - this.getBBox().width / 2;
        });
    };

    var updateViewport = function() {
      var viewport = elem.nav.right.viewport;

      /* Lock the extent of the viewport */
      var extentMin = viewport.extent()[0],
          extentMax = viewport.extent()[1],
          domainMin = scales.nav.right.x.domain()[0],
          domainMax = scales.nav.right.x.domain()[1];

      var correctLen = spanLen(prefs.defaultViewportExtent);

      if (spanLen(viewport.extent()) !== correctLen) {
        if (extentMin + correctLen > domainMax) {
          viewport.extent([domainMax - correctLen, domainMax]);
        } else if (extentMax - correctLen < domainMin) {
          viewport.extent([domainMin, domainMin + correctLen]);
        } else {
          viewport.extent([extentMin, extentMin + correctLen]);
        }
      }

      /* Move our custom right slider to match the viewport extent */
      elem.nav.right.clip.select('#navToggleRight')
        .attr('x', scales.nav.right.x(viewport.extent()[0]));
    };

    var rescalePlotElements = function() {
      elem.plot.clip.selectAll('.bar')
        // Assume 20 Mhz width
        .attr('width', function(d) {
          return barWidth(scales.plot.x);
        });
    };

    var resetPlotXAxis = function() {
      rescalePlotXAxis();
      elem.plot.axis.x.ticks(spanLen(scales.plot.x.domain()));
      elem.plot.container.select('.x.axis').call(elem.plot.axis.x);
      removeNonChannelTicks();
    };

    var rescalePlotXAxis = function() {
      if (band === '2_4') {
        scales.plot.x.domain(prefs.domain2_4);
      } else if (band === '5') {
        scales.plot.x.domain(elem.nav.right.viewport.extent());
      }

      elem.plot.container.select('.x.axis').call(elem.plot.axis.x);
      removeNonChannelTicks();
    };

    var rescaleVertically = function(data) {
      var maxOccupancy = d3.max(data, function(d) {
        return d.occupancy;
      });

      var updateElements = false;

      if (maxOccupancy >= scales.plot.y.domain()[1]) {
        scales.plot.y.domain([0, maxOccupancy * 1.125]);
        scales.nav.y.domain([0, maxOccupancy * 1.125]);
        updateElements = true;
      } else if (maxOccupancy < prefs.range[1] * 0.875) {
        scales.plot.y.domain(prefs.range);
        scales.nav.y.domain(prefs.range);
        updateElements = true;
      }

      if (updateElements) {
        elem.plot.container.select('.y.axis').call(elem.plot.axis.y);

        elem.plot.clip.selectAll('.bar')
          .attr('height', function(d) {
            return scales.plot.y(0) - scales.plot.y(d.occupancy);
          })
          .attr('y', function(d) {
            return scales.plot.y;
          });

        elem.plot.clip.selectAll('text')
          .attr('y', function(d) {
            return scales.plot.y(d.occupancy) - prefs.labelPadding
          });

        elem.nav.left.clip.selectAll('.bar')
          .attr('height', function(d) {
            return scales.nav.y(0) - scales.nav.y(d.occupancy);
          })
          .attr('y', function(d) {
            return scales.nav.y;
          });

        elem.nav.right.clip.selectAll('.bar')
          .attr('height', function(d) {
            return scales.nav.y(0) - scales.nav.y(d.occupancy);
          })
          .attr('y', function(d) {
            return scales.nav.y;
          });
      }
    };

    var removeNonChannelTicks = function() {
      elem.plot.container.selectAll('.x.axis > .tick')
        .filter(function (d) {return ! isChannel(d.toString());})
          .remove();
    };

    var updateBars = function(view, data) {
      var xScale, yScale, clip;

      if (view === 'plot') {
        xScale = scales.plot.x;
        yScale = scales.plot.y;
        clip = elem.plot.clip;
      } else if (view === 'navLeft') {
        xScale = scales.nav.left.x;
        yScale = scales.nav.y;
        clip = elem.nav.left.clip;
      } else if (view === 'navRight') {
        xScale = scales.nav.right.x;
        yScale = scales.nav.y;
        clip = elem.nav.right.clip;
      } else {
        return;
      }

      var bars = clip.selectAll('.bar')
        .data(data, function(d) {
          return d.channel;
        });

      bars.enter().append('rect')
        .classed('bar', true)
        .attr('width', barWidth(xScale))
        .attr('height', 0)
        .attr('x', function(d) {
          return xScale(d.channel) - barWidth(xScale) / 2;
        })
        .attr('y', yScale(0))
        .attr('fill', prefs.barFillColor)
        .attr('stroke-width', prefs.barStrokeWidth)
        .attr('stroke', prefs.barStrokeColor)
          .transition()
          .duration(prefs.transitionInterval)
            .attr('height', function(d) {
              return yScale(0) - yScale(d.occupancy);
            })
            .attr('y', function(d) {
              return yScale(d.occupancy);
            });

      bars
        .transition()
        .duration(prefs.transitionInterval)
          .attr('y', function(d) {
            return yScale(d.occupancy);
          })
          .attr('height', function(d) {
            return yScale(0) - yScale(d.occupancy);
          });

      bars.exit()
        .transition()
        .duration(prefs.transitionInterval)
          .attr('y', yScale(0))
          .remove();
    };

    var updateLabels = function(data) {
      var labels = elem.plot.clip.selectAll('text')
        .data(data, function(d) {
          return d.channel;
        });

      labels.enter().append('text')
        .text(function(d) {
          return d.occupancy;
        })
        .attr('fill', prefs.labelColor)
        .attr('x', function(d) {
          return scales.plot.x(d.channel) - this.getBBox().width / 2;
        })
        .attr('y', scales.plot.y(0))
        .transition()
        .duration(prefs.transitionInterval)
          .attr('y', function(d) {
            return scales.plot.y(d.occupancy) - prefs.labelPadding;
          });

      labels
        .transition()
        .duration(prefs.transitionInterval)
          .attr('y', function(d) {
            return scales.plot.y(d.occupancy) - prefs.labelPadding;
          })
          .text(function(d) {
            return d.occupancy;
          });

      labels.exit()
      .transition()
      .duration(prefs.transitionInterval)
        .attr('y', scales.plot.y(-100))
        .remove();
    };

    init();
  });

}]);
