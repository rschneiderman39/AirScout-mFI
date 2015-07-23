app.controller('channelGraphCtrl', ['$scope', 'channelGraphDataService',
  'utilService', 'cordovaService', function($scope, channelGraphDataService,
  utilService, cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        var X_DOMAIN_2_4 = channelGraphDataService.getXDomain('2_4Ghz'),
            X_DOMAIN_5 = channelGraphDataService.getXDomain('5Ghz'),
            Y_DOMAIN = channelGraphDataService.getYDomain(),
            FILL_ALPHA = 0.2,
            LABEL_PADDING = 10,
            UPDATE_INTERVAL = 2000,
            TRANSITION_INTERVAL = 1000,
            band = undefined;

        var spanLen = utilService.spanLen,
            isChannel = utilService.isChannel,
            setAlpha = utilService.setAlpha;

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

        var viewportSize;

        var init = function() {
          dim.width = document.deviceWidth * 0.95;
          dim.height = (document.deviceHeight - document.topBarHeight) * 0.95;

          dim.plot.totalWidth = dim.width;
          dim.nav.totalWidth = dim.width;

          dim.plot.totalHeight = dim.height * dim.topPercent;
          dim.nav.totalHeight = dim.height * (1 - dim.topPercent);

          buildPlot();
          buildNav();
          setBand(channelGraphDataService.getBand());

          var updateLoop = setInterval(update, UPDATE_INTERVAL)

          $scope.$on('$destroy', function() {
            clearInterval(updateLoop);
            pushSettings();
          });

          update();
        };

        var update = function() {
          var data = channelGraphDataService.generateData();

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
            .domain(X_DOMAIN_2_4)
            .range([0, dim.plot.width]);

          scales.plot.y = d3.scale.linear()
            .domain(Y_DOMAIN)
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
          /* Nav Container */
          dim.nav.width = dim.nav.totalWidth - dim.nav.margin.left - dim.nav.margin.right;
          dim.nav.height = dim.nav.totalHeight - dim.nav.margin.top - dim.nav.margin.bottom;

          scales.nav = {};

          scales.nav.y = d3.scale.linear()
            .domain(Y_DOMAIN)
            .range([dim.nav.height, 0]);

          elem.nav = {};

          elem.nav.container = d3.select('#nav').append('svg')
            .attr('width', dim.nav.totalWidth)
            .attr('height', dim.nav.totalHeight)
            .append('g')
              .attr('transform', 'translate(' + dim.nav.margin.left + ',' + dim.nav.margin.top + ')');

          /* Left Nav Container */
          dim.nav.left = {};

          dim.nav.left.width = dim.nav.width * dim.nav.leftPercent;

          scales.nav.left = {};

          scales.nav.left.x = d3.scale.linear()
            .domain(X_DOMAIN_2_4)
            .range([0, dim.nav.left.width]);

          elem.nav.left = {};

          elem.nav.left.clip = elem.nav.container.append('g')
            .attr('clip-path', 'url(#nav-clip-left)')
            .on('click', function() {
              if (band !== '2_4Ghz') setBand('2_4Ghz');
            });

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

          scales.nav.right = {};

          scales.nav.right.x = d3.scale.linear()
            .domain(X_DOMAIN_5)
            .range([0, dim.nav.right.width]);

          elem.nav.right = {};

          elem.nav.right.container = elem.nav.container.append('g')
            .classed('navigator', true)
            .attr('transform', 'translate(' + dim.nav.left.width + ', 0)');

          elem.nav.right.clip = elem.nav.right.container.append('g')
            .attr('clip-path', 'url(#nav-clip-right)');

          elem.nav.right.clip.append('clipPath')
            .attr('id', 'nav-clip-right')
            .append('rect')
              .attr({ width: dim.nav.right.width, height: dim.nav.height });

          /* Right Nav Viewport */
          elem.nav.right.viewport = d3.svg.brush()
            .x(scales.nav.right.x)
            .extent(channelGraphDataService.getWindowExtent5Ghz())
            .on("brushstart", function() {
              updateViewport();
              if (band !== '5Ghz') setBand('5Ghz');
            })
            .on("brush", function() {
              updateViewport();
              updatePlotAxisPosition();
              updatePlotElementPosition();
            })
            .on("brushend", function() {
              updateViewport();
              updatePlotAxisPosition();
              updatePlotElementPosition();
            });

          viewportSize = spanLen(elem.nav.right.viewport.extent());

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
          elem.nav.container.append('path')
            .attr('d', 'M 0 0 H ' + dim.nav.width)
            .attr('stroke', 'black');

          elem.nav.container.append('path')
            .attr('d', 'M 0 ' + dim.nav.height + ' H ' + dim.nav.width)
            .attr('stroke', 'black');

          elem.nav.container.append('path')
            .attr('d', 'M 0 0 V ' + dim.nav.height)
            .attr('stroke', 'black');

          elem.nav.container.append('path')
            .attr('d', 'M ' + dim.nav.left.width + ' 0 V ' + dim.nav.height)
            .attr('stroke', 'black');

          elem.nav.container.append('path')
            .attr('d', 'M ' + dim.nav.width + ' 0 V ' + dim.nav.height)
            .attr('stroke', 'black');

          /* Draw Nav Labels */
          elem.nav.container.append('text')
            .text('2.4 Ghz')
            .attr('y', dim.nav.height + dim.nav.margin.bottom);

          elem.nav.container.append('text')
            .text('5 Ghz')
            .attr('x', dim.nav.left.width)
            .attr('y', dim.nav.height + dim.nav.margin.bottom);
        };

        var setBand = function(newBand) {
          if (newBand ===  '2_4Ghz') {
            elem.nav.right.clip.select('#navToggleRight').classed('active', false);
            elem.nav.left.clip.select('#navToggleLeft').classed('active', true);
          } else if (newBand === '5Ghz') {
            elem.nav.left.clip.select('#navToggleLeft').classed('active', false);
            elem.nav.right.clip.select('#navToggleRight').classed('active', true);
          }
          band = newBand;

          updatePlotAxisScale();
          updatePlotElementScale();
          updatePlotElementPosition();
        };

        var pushSettings = function() {
          channelGraphDataService.setBand(band);
          channelGraphDataService.setWindowExtent5Ghz(elem.nav.right.viewport.extent());
        };

        var updatePlotElementPosition = function() {
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
          if (spanLen(viewport.extent()) !== viewportSize) {
            var extentMin = viewport.extent()[0];
            viewport.extent([extentMin, extentMin + viewportSize]);
          }

          /* Move our custom right slider to match the viewport extent */
          elem.nav.right.clip.select('#navToggleRight')
            .attr('x', scales.nav.right.x(viewport.extent()[0]));
        };

        var updatePlotElementScale = function() {
          elem.plot.clip.selectAll('ellipse')
            .attr('rx', function(d) {
              return (scales.plot.x(d.channel) - scales.plot.x(d.channel - 1)) * 2;
            });
        };

        var updatePlotAxisScale = function() {
          updatePlotAxisPosition();
          elem.plot.axis.x.ticks(spanLen(scales.plot.x.domain()));
          elem.plot.container.select('.x.axis').call(elem.plot.axis.x);
          removeNonChannelTicks();
        };

        var updatePlotAxisPosition = function() {
          if (band === '2_4Ghz') {
            scales.plot.x.domain(X_DOMAIN_2_4);
          } else if (band === '5Ghz') {
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
            .duration(TRANSITION_INTERVAL)
              .attr('y', function(d) {
                return scales.plot.y(d.level) - LABEL_PADDING;
              });

          labels
            .transition()
            .duration(TRANSITION_INTERVAL)
              .attr('y', function(d) {
                return scales.plot.y(d.level) - LABEL_PADDING;
              });

          labels.exit()
          .transition()
          .duration(TRANSITION_INTERVAL)
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

          var parabs = clip.selectAll('ellipse')
            .data(data, function(d) {
              return d.BSSID;
            });

          /* Add new parabolas */
          parabs.enter().append('ellipse')
            .attr('cx', function(d) {
              return xScale(d.channel);
            })
            .attr('cy', yScale(-100))
            .attr('rx', function(d) {
              return (xScale(d.channel) - xScale(d.channel - 1)) * 2;
            })
            .attr('ry', 0)
            .attr('stroke', function(d) {
              return d.color;
            })
            .attr('fill', function(d) {
              return setAlpha(d.color, FILL_ALPHA);
            })
            .attr('stroke-width', '2')
              .transition()
              .duration(TRANSITION_INTERVAL)
                .attr('ry', function(d) {
                  return yScale(-100) - yScale(d.level);
                });

          /* Update existing parabolas */
          parabs
            .transition()
            .duration(TRANSITION_INTERVAL)
              .attr('ry', function(d) {
                return yScale(-100) - yScale(d.level);
              });

          /* Remove parabolas that are no longer bound to data */
          parabs.exit()
            .transition()
            .duration(TRANSITION_INTERVAL)
              .attr('ry', 0)
              .remove();
        };

        init();
      },
      function rejected() {
        console.log('channelGraphCtrl is unavailable because Cordova is not loaded.');
      }
    )
}]);
