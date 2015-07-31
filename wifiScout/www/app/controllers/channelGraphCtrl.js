app.controller('channelGraphCtrl', ['$scope', 'channelGraphState',
'channels', 'setupService', function($scope, channelGraphState, channels,
setupService) {

  var prefs = {
    defaultBand: '2_4',
    defaultSliderExtent: [34, 66],
    fillAlpha: 0.2,
    labelPadding: 10,
    domain2_4: [-1, 15],
    domain5: [34, 167],
    range: [-100, -30],
    updateInterval: 2000,
    transitionInterval: 1800
  };

  setupService.ready.then(function() {
    $scope.strings = globals.strings;

    var band = undefined;

    var spanLen = globals.utils.spanLen,
        setAlpha = globals.utils.setAlpha,
        isChannel = channels.isChannel;

    var elem = {}, scales = {};

    var dim = {
                topPercent: .8,
                plot: {
                  margin: {
                    top: 20,
                    bottom: 20,
                    left: 40,
                    right: 0,
                  }
                },
                nav: {
                  leftPercent: 0.2,
                  margin: {
                    top: 1,
                    bottom: 18,
                    left: 40,
                    right: 0,
                  }
                }
              };

    var viewportExtentLength;

    var init = function() {
      dim.width = globals.format.window.width * 0.95;
      dim.height = (globals.format.window.height - globals.format.topBar.height) * 0.95;

      dim.plot.totalWidth = dim.width;
      dim.nav.totalWidth = dim.width;

      dim.plot.totalHeight = dim.height * dim.topPercent;
      dim.nav.totalHeight = dim.height * (1 - dim.topPercent);

      buildPlot();
      buildNav();
      $scope.setBand(channelGraphState.band() || prefs.defaultBand);

      var updateLoop = setInterval(update, prefs.updateInterval)

      $scope.$on('$destroy', function() {
        clearInterval(updateLoop);
        storeSettings();
      });

      update();
    };

    var update = function() {
      var data = channelGraphState.getData();

      updateParabolas('plot', data);
      updateParabolas('navLeft', data);
      updateParabolas('navRight', data);
      updateLabels(data);
    };

    var buildPlot = function() {
      /* Plot Container */
      dim.plot.width = dim.plot.totalWidth - dim.plot.margin.left - dim.plot.margin.right;
      dim.plot.height = dim.plot.totalHeight - dim.plot.margin.top - dim.plot.margin.bottom;

      elem.plot = {};

      elem.plot.container = d3.select('#plot').classed('chart', true).append('svg')
        .attr('width', dim.plot.totalWidth)
        .attr('height', dim.plot.totalHeight)
        .append('g')
          .attr('transform', 'translate(' + dim.plot.margin.left + ',' + dim.plot.margin.top + ')');

      elem.plot.clip = elem.plot.container.append('g')
        .attr('clip-path', 'url(#plot-clip)')

      elem.plot.clip.append('clipPath')
        .attr('id', 'plot-clip')
        .append('rect')
          .attr({ width: dim.plot.width, height: dim.plot.height });

      /* Plot Axes */
      scales.plot = {};

      scales.plot.x = d3.scale.linear()
        .domain(prefs.domain2_4)
        .range([0, dim.plot.width]);

      scales.plot.y = d3.scale.linear()
        .domain(prefs.range)
        .range([dim.plot.height, 0]);

      elem.plot.axis = {};

      elem.plot.axis.x = d3.svg.axis()
        .scale(scales.plot.x)
        .orient('bottom')
        .ticks(spanLen(scales.plot.x))
        .tickSize(1);

      elem.plot.axis.y = d3.svg.axis()
        .scale(scales.plot.y)
        .orient('left')
        .ticks(8)
        .tickSize(1);

      elem.plot.container.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + dim.plot.height + ')')
        .call(elem.plot.axis.x);

      elem.plot.container.append('g')
        .attr('class', 'y axis')
        .call(elem.plot.axis.y);
    };

    var buildNav = function() {
      /* Find nav dimensions and scales */
      dim.nav.width = dim.nav.totalWidth - dim.nav.margin.left - dim.nav.margin.right;
      dim.nav.height = dim.nav.totalHeight - dim.nav.margin.top - dim.nav.margin.bottom;

      scales.nav = {};

      scales.nav.y = d3.scale.linear()
        .domain(prefs.range)
        .range([dim.nav.height, 0]);

      /* Left Nav */
      dim.nav.left = {};

      dim.nav.left.width = dim.nav.width * dim.nav.leftPercent;
      dim.nav.left.totalWidth = dim.nav.left.width + dim.nav.margin.left;

      scales.nav.left = {};

      scales.nav.left.x = d3.scale.linear()
        .domain(prefs.domain2_4)
        .range([0, dim.nav.left.width]);

      elem.nav = {};
      elem.nav.left = {};

      elem.nav.left.container = d3.select('#navLeft').append('svg')
        .attr('width', dim.nav.left.totalWidth)
        .attr('height', dim.nav.totalHeight)
        .append('g')
          .attr('transform', 'translate(' + dim.nav.margin.left + ',' + dim.nav.margin.top + ')');

      elem.nav.left.clip = elem.nav.left.container.append('g')
        .attr('clip-path', 'url(#nav-clip-left)')

      elem.nav.left.clip.append('clipPath')
        .attr('id', 'nav-clip-left')
        .append('rect')
          .attr('width', dim.nav.left.width)
          .attr('height', dim.nav.height);

      /* Left Nav Slider */
      elem.nav.left.clip.append('rect')
        .attr('id', 'navToggleLeft')
        .attr('width', dim.nav.left.width)
        .attr('height', dim.nav.height)

      /* Right Nav Containers */
      dim.nav.right = {};

      dim.nav.right.width = dim.nav.width * (1 - dim.nav.leftPercent);
      dim.nav.right.totalWidth = dim.nav.right.width + dim.nav.margin.right;

      scales.nav.right = {};

      scales.nav.right.x = d3.scale.linear()
        .domain(prefs.domain5)
        .range([0, dim.nav.right.width]);

      elem.nav.right = {};

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

      /* Right Nav Viewport */
      elem.nav.right.viewport = d3.svg.brush()
        .x(scales.nav.right.x)
        .extent(channelGraphState.sliderExtent() || prefs.defaultSliderExtent)
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

      viewportExtentLength = spanLen(elem.nav.right.viewport.extent());

      elem.nav.right.container.append("g")
        .attr("class", "viewport")
        .call(elem.nav.right.viewport)
          .selectAll("rect")
          .attr("height", dim.nav.height);

      /* Right Nav Slider */
      elem.nav.right.clip.append('rect')
        .attr('id', 'navToggleRight')
        .attr('width', elem.nav.right.container.select('.viewport > .extent').attr('width'))
        .attr('height', dim.nav.height)
        .attr('x', scales.nav.right.x(elem.nav.right.viewport.extent()[0]));

      /* Draw Nav Borders */
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

      /* Draw Nav Labels */
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

    var storeSettings = function() {
      channelGraphState.band(band);
      channelGraphState.sliderExtent(elem.nav.right.viewport.extent());
    };

    var repositionPlotElements = function() {
      /* Move parabolas */
      elem.plot.clip.selectAll('ellipse')
        .attr('cx', function(d) {
          return scales.plot.x(d.channel);
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

      if (spanLen(viewport.extent()) !== viewportExtentLength) {
        if (extentMin + viewportExtentLength > domainMax) {
          viewport.extent([domainMax - viewportExtentLength, domainMax]);
        } else if (extentMax - viewportExtentLength < domainMin) {
          viewport.extent([domainMin, domainMin + viewportExtentLength]);
        } else {
          viewport.extent([extentMin, extentMin + viewportExtentLength]);
        }
      }

      /* Move our custom right slider to match the viewport extent */
      elem.nav.right.clip.select('#navToggleRight')
        .attr('x', scales.nav.right.x(viewport.extent()[0]));
    };

    var rescalePlotElements = function() {
      elem.plot.clip.selectAll('ellipse')
        // Assume 20 Mhz width
        .attr('rx', function(d) {
          return (scales.plot.x(d.channel) - scales.plot.x(d.channel - 1)) * 2;
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

    var removeNonChannelTicks = function() {
      elem.plot.container.selectAll('.x.axis > .tick')
        .filter(function (d) {return ! isChannel(d.toString());})
          .remove();
    };

    var updateLabels = function(data) {
      var labels = elem.plot.clip.selectAll('text')
        .data(data, function(d) {
          return d.BSSID;
        });

      labels.enter().append('text')
        .text(function(d) {
          return d.SSID;
        })
        .attr('fill', function(d) {
          return d.color;
        })
        .attr('x', function(d) {
          return scales.plot.x(d.channel) - this.getBBox().width / 2;
        })
        .attr('y', scales.plot.y(-100))
        .transition()
        .duration(prefs.transitionInterval)
          .attr('y', function(d) {
            return scales.plot.y(d.level) - prefs.labelPadding;
          });

      labels
        .transition()
        .duration(prefs.transitionInterval)
          .attr('y', function(d) {
            return scales.plot.y(d.level) - prefs.labelPadding;
          });

      labels.exit()
      .transition()
      .duration(prefs.transitionInterval)
        .attr('y', scales.plot.y(-100))
        .remove();
    };

    var updateParabolas = function(view, data) {
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

      var parabolas = clip.selectAll('ellipse')
        .data(data, function(d) {
          return d.BSSID;
        });

      /* Add new parabolas */
      parabolas.enter().append('ellipse')
        .attr('cx', function(d) {
          return xScale(d.channel);
        })
        .attr('cy', yScale(-100))
        // Assume 20 Mhz width
        .attr('rx', function(d) {
          return (xScale(d.channel) - xScale(d.channel - 1)) * 2;
        })
        .attr('ry', 0)
        .attr('stroke', function(d) {
          return d.color;
        })
        .attr('fill', function(d) {
          return setAlpha(d.color, prefs.fillAlpha);
        })
        .attr('stroke-width', '2')
          .transition()
          .duration(prefs.transitionInterval)
            .attr('ry', function(d) {
              return yScale(-100) - yScale(d.level);
            });

      /* Update existing parabolas */
      parabolas
        .transition()
        .duration(prefs.transitionInterval)
          .attr('ry', function(d) {
            return yScale(-100) - yScale(d.level);
          });

      /* Remove parabolas that are no longer bound to data */
      parabolas.exit()
        .transition()
        .duration(prefs.transitionInterval)
          .attr('ry', 0)
          .remove();
    };

    init();
  });

}]);
