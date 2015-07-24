app.controller('channelGraphCtrl', ['$scope', 'channelGraphData',
  'utils', 'cordovaService', function($scope, channelGraphData,
  utils, cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        var X_DOMAIN_2_4 = channelGraphData.getXDomain('2_4Ghz'),
            X_DOMAIN_5 = channelGraphData.getXDomain('5Ghz'),
            Y_DOMAIN = channelGraphData.getYDomain(),
            FILL_ALPHA = 0.2,
            LABEL_PADDING = 10,
            UPDATE_INTERVAL = 2000,
            TRANSITION_INTERVAL = 1000,
            band = undefined;

        var spanLen = utils.spanLen,
            isChannel = utils.isChannel,
            setAlpha = utils.setAlpha;

        var elem = {
          plot: undefined,
          plotClip: undefined,
          nav: undefined,
          navLeft: undefined,
          navLeftClip: undefined,
          navRight: undefined,
          navRightClip: undefined,
          viewportLeft: undefined,
          viewportRight: undefined,
          xAxis: undefined
        };

        var viewportSizeRight;

        var dim = {
                    width: undefined,
                    height: undefined,
                    topPercent: .8,
                    plot: {
                      totalWidth: undefined,
                      totalHeight: undefined,
                      width: undefined,
                      height: undefined,
                      margin: {
                        top: 20,
                        bottom: 20,
                        left: 40,
                        right: 0,
                      }
                    },
                    nav: {
                      totalWidth: undefined,
                      totalHeight: undefined,
                      leftPercent: 0.2,
                      width: undefined,
                      height: undefined,
                      left: {
                        width: undefined
                      },
                      right: {
                        width: undefined
                      },
                      margin: {
                        top: 1,
                        bottom: 18,
                        left: 40,
                        right: 0,
                      }
                    }
                  };

        var scales = {
                      plot: {
                        x: undefined,
                        y: undefined
                      },
                      nav: {
                        y: undefined,
                        left: {
                          x: undefined
                        },
                        right: {
                          x: undefined
                        }
                      }
                     };

        var init = function() {
          dim.width = document.deviceWidth * 0.95;
          dim.height = (document.deviceHeight - document.topBarHeight) * 0.9;

          dim.plot.totalWidth = dim.width;
          dim.nav.totalWidth = dim.width;

          dim.plot.totalHeight = dim.height * dim.topPercent;
          dim.nav.totalHeight = dim.height * (1 - dim.topPercent);

          addPlot();
          addNav();
          setBand(channelGraphData.getBand());

          var updateLoop = setInterval(update, UPDATE_INTERVAL)

          $scope.$on('$destroy', function() {
            clearInterval(updateLoop);
            pushSettings();
            clear();
          });

          update();
        };

        var update = function() {
          var data = channelGraphData.generate();

          updateParabs('plot', data);
          updateParabs('navLeft', data);
          updateParabs('navRight', data);

          updateLabels(data);
        };

        var addPlot = function() {
          dim.plot.width = dim.plot.totalWidth - dim.plot.margin.left - dim.plot.margin.right;
          dim.plot.height = dim.plot.totalHeight - dim.plot.margin.top - dim.plot.margin.bottom;

          elem.plot = d3.select('#plot').classed('chart', true).append('svg')
            .attr('width', dim.plot.totalWidth)
            .attr('height', dim.plot.totalHeight)
            .append('g')
              .attr('transform', 'translate(' + dim.plot.margin.left + ',' + dim.plot.margin.top + ')');

          elem.plotClip = elem.plot.append('g')
            .attr('clip-path', 'url(#plotClip)');

          elem.plotClip.append('clipPath')
            .attr('id', 'plotClip')
            .append('rect')
              .attr({ width: dim.plot.width, height: dim.plot.height });

          addPlotAxes();
        };

        var addPlotAxes = function() {
          scales.plot.x = d3.scale.linear()
            .domain(X_DOMAIN_2_4)
            .range([0, dim.plot.width]);

          scales.plot.y = d3.scale.linear()
            .domain(Y_DOMAIN)
            .range([dim.plot.height, 0]);

          elem.xAxis = d3.svg.axis()
            .scale(scales.plot.x)
            .orient('bottom')
            .ticks(spanLen(scales.plot.x))
            .tickSize(1);

          var yAxis = d3.svg.axis()
            .scale(scales.plot.y)
            .orient('left')
            .ticks(8)
            .tickSize(1);

          elem.plot.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + dim.plot.height + ')')
            .call(elem.xAxis);

          elem.plot.append('g')
            .attr('class', 'y axis')
            .call(yAxis);

          removeNonChannelTicks();
        };

        var addNav = function() {
          dim.nav.width = dim.nav.totalWidth - dim.nav.margin.left - dim.nav.margin.right;
          dim.nav.height = dim.nav.totalHeight - dim.nav.margin.top - dim.nav.margin.bottom;

          scales.nav.y = d3.scale.linear()
            .domain(Y_DOMAIN)
            .range([dim.nav.height, 0]);

          elem.nav = d3.select('#nav').classed('chart', true).append('svg')
            .attr('width', dim.nav.totalWidth)
            .attr('height', dim.nav.totalHeight)
            .append('g')
              .attr('transform', 'translate(' + dim.nav.margin.left + ',' + dim.nav.margin.top + ')');

          addNavLeft();
          addNavRight();
          addNavAxes();
          addNavLabels();
        };

        var addNavAxes = function() {
          elem.nav.append('path')
            .attr('d', 'M 0 0 H ' + dim.nav.width)
            .attr('stroke', 'black');

          elem.nav.append('path')
            .attr('d', 'M 0 ' + dim.nav.height + ' H ' + dim.nav.width)
            .attr('stroke', 'black');

          elem.nav.append('path')
            .attr('d', 'M 0 0 V ' + dim.nav.height)
            .attr('stroke', 'black');

          elem.nav.append('path')
            .attr('d', 'M ' + dim.nav.left.width + ' 0 V ' + dim.nav.height)
            .attr('stroke', 'black');

          elem.nav.append('path')
            .attr('d', 'M ' + dim.nav.width + ' 0 V ' + dim.nav.height)
            .attr('stroke', 'black');
        };

        var addNavLabels = function() {
          elem.nav.append('text')
            .text('2.4 Ghz')
            .attr('y', dim.nav.height + dim.nav.margin.bottom);

          elem.nav.append('text')
            .text('5 Ghz')
            .attr('x', dim.nav.left.width)
            .attr('y', dim.nav.height + dim.nav.margin.bottom);
        };

        var addNavRight = function() {
          dim.nav.right.width = dim.nav.width * (1 - dim.nav.leftPercent);

          scales.nav.right.x = d3.scale.linear()
            .domain(X_DOMAIN_5)
            .range([0, dim.nav.right.width]);

          elem.navRight = elem.nav.append('g')
            .attr('transform', 'translate(' + dim.nav.left.width + ', 0)')
            .append('svg')
              .classed('navigator', true)
              .attr('width', dim.nav.right.width)
              .attr('height', dim.nav.height);

          elem.navRightClip = elem.navRight.append('g')
            .attr('clip-path', 'url(#navRightClip)');

          elem.navRightClip.append('clipPath')
            .attr('id', 'navRightClip')
            .append('rect')
              .attr({ width: dim.nav.right.width, height: dim.nav.height });

          addViewportRight();
        };


        var addViewportRight = function() {
          elem.viewportRight = d3.svg.brush()
            .x(scales.nav.right.x)
            .extent(channelGraphData.getWindowExtent5Ghz())
            .on("brushstart", function() {
              if (band !== '5Ghz') setBand('5Ghz');
              moveRightViewport();
              movePlotElements();
            })
            .on("brush", function() {
              moveRightViewport();
              movePlotAxis();
              movePlotElements();
            })
            .on("brushend", function() {
              moveRightViewport();
              movePlotAxis();
              movePlotElements();
            });

          elem.navRight.append("g")
            .attr("class", "viewport")
            .call(elem.viewportRight)
              .selectAll("rect")
              .attr("height", dim.nav.height);

          viewportSizeRight = spanLen(elem.viewportRight.extent());

          elem.navRightClip.append('rect')
            .attr('id', 'rightSlider')
            .attr('width', elem.navRight.select('.viewport > .extent').attr('width'))
            .attr('height', dim.nav.height)
            .attr('x', scales.nav.right.x(elem.viewportRight.extent()[0]));
        };

        var addNavLeft = function() {
          dim.nav.left.width = dim.nav.width * dim.nav.leftPercent;

          scales.nav.left.x = d3.scale.linear()
            .domain(X_DOMAIN_2_4)
            .range([0, dim.nav.left.width]);

          elem.navLeft = elem.nav.append('svg')
            .classed('navigator', true)
            .attr('width', dim.nav.left.width)
            .attr('height', dim.nav.height);

          elem.navLeftClip = elem.navLeft.append('g')
            .attr('clip-path', 'url(#navLeftClip)');

          elem.navLeftClip.append('clipPath')
            .attr('id', 'navLeftClip')
            .append('rect')
              .attr({ width: dim.nav.left.width, height: dim.nav.height });

          addViewportLeft();
        };

        var addViewportLeft = function() {
          elem.viewportLeft = d3.svg.brush()
            .x(scales.nav.left.x)
            .extent(X_DOMAIN_2_4)
            .on("brushstart", function() {
              if (band !== '2_4Ghz') setBand('2_4Ghz');
              movePlotElements();
              lockLeftViewport();
            })
            .on("brush", lockLeftViewport)
            .on("brushend", lockLeftViewport);

          elem.navLeft.append("g")
            .attr("class", "viewport")
            .call(elem.viewportLeft)
              .selectAll("rect")
              .attr("height", dim.nav.height);

          elem.navLeftClip.append('rect')
            .attr('id', 'leftSlider')
            .attr('width', dim.nav.left.width)
            .attr('height', dim.nav.height)
        };

        var setBand = function(newBand) {
          if (newBand ===  '2_4Ghz') {
            elem.navRightClip.select('#rightSlider').classed('active', false);
            elem.navLeftClip.select('#leftSlider').classed('active', true);
          } else if (newBand === '5Ghz') {
            elem.navLeftClip.select('#leftSlider').classed('active', false);
            elem.navRightClip.select('#rightSlider').classed('active', true);
          }
          band = newBand;

          elem.nav.selectAll('.viewport')
            .style('pointer-events', 'all');

          updatePlotAxisScale();
          rescalePlotElements();
        };

        var pushSettings = function() {
          channelGraphData.setBand(band);
          channelGraphData.setWindowExtent5Ghz(elem.viewportRight.extent());
        };

        var movePlotElements = function() {
          /* Move parabolas */
          elem.plotClip.selectAll('ellipse')
            .attr('cx', function(d) {
              return scales.plot.x(d.channel);
            });

          /* Move labels */
          elem.plotClip.selectAll('text')
            .attr('x', function(d) {
              return scales.plot.x(d.channel) - this.getBBox().width / 2;
            });
        };

        var movePlotAxis = function() {
          if (band === '2_4Ghz') {
            scales.plot.x.domain(X_DOMAIN_2_4);
          } else if (band === '5Ghz') {
            scales.plot.x.domain(elem.viewportRight.extent());
          }

          elem.plot.select('.x.axis').call(elem.xAxis);
          removeNonChannelTicks();
        };

        var lockLeftViewport = function() {
          elem.viewportLeft.extent(X_DOMAIN_2_4);
        };

        var moveRightViewport = function() {
          if (spanLen(elem.viewportRight.extent()) !== viewportSizeRight) {
            var extentMin = elem.viewportRight.extent()[0];
            elem.viewportRight.extent([extentMin, extentMin + viewportSizeRight]);
          }

          /* Move our custom right slider to match the brush extent */
          elem.navRightClip.select('#rightSlider')
            .attr('x', scales.nav.right.x(elem.viewportRight.extent()[0]));
        };

        var removeNonChannelTicks = function() {
          elem.plot.selectAll('.x.axis > .tick')
            .filter(function (d) {return ! isChannel(d.toString());})
              .remove();
        };

        var rescalePlotElements = function() {
          elem.plotClip.selectAll('ellipse')
            .attr('rx', function(d) {
              return (scales.plot.x(d.channel) - scales.plot.x(d.channel - 1)) * 2;
            })
            .attr('x', function(d) {
              return scales.plot.x(d.channel);
            });

          elem.plotClip.selectAll('text')
            .attr('x', function(d) {
              return (scales.plot.x(d.channel) - this.getBBox().width / 2);
            });
        };

        var updatePlotAxisScale = function() {
          movePlotAxis();
          elem.xAxis.ticks(spanLen(scales.plot.x.domain()));
          elem.plot.select('.x.axis').call(elem.xAxis);
          removeNonChannelTicks();
        };

        var updateLabels = function(data) {
          var labels = elem.plotClip.selectAll('text')
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

        var updateParabs = function(view, data) {
          var xScale, yScale, clip;

          if (view === 'plot') {
            xScale = scales.plot.x;
            yScale = scales.plot.y;
            clip = elem.plotClip;
          } else if (view === 'navLeft') {
            xScale = scales.nav.left.x;
            yScale = scales.nav.y;
            clip = elem.navLeftClip;
          } else if (view === 'navRight') {
            xScale = scales.nav.right.x;
            yScale = scales.nav.y;
            clip = elem.navRightClip;
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

        var clear = function() {
          destroy(dim);
          destroy(scales);
          destroy(elem);
        };

        init();
      },
      function rejected() {
        console.log('channelGraphCtrl is unavailable because Cordova is not loaded.');
      }
    )
}]);
