app.controller('channelTableCtrl', ['$scope', 'accessPoints', 'globalSettings',
  'channelTableState', 'channelChecker', 'setupService', function($scope, accessPoints,
  globalSettings, channelTableState, channelChecker, setupService) {

  setupService.ready.then(function() {

    var updateInterval = constants.updateIntervalSlow;

    var config = {
      defaultBand: '2_4',              // Band shown on first view open ('2_4' or '5')
      domain2_4: [-1, 15],             // X-scale for 2.4 Ghz band
      domain5 : [34, 167],             // X-scale for 5 Ghz band
      range : [0, 15],                 // Y-scale for occupancy
      defaultSliderExtent: [34, 66], // 5Ghz nav viewport extent on first view open
      labelPadding: 10,                // Pixels between bar top and label bottom
      labelColor: 'black',             // Style...
      barStrokeWidth: 0,
      barStrokeColor: 'none',
      barFillColor: '#62BF01',
      barWidth: 0.8,
      disallowedChannelOpacity: 0.35,
      disallowedChannelColor: 'black',
      navPercent: 0.2,                 // The portion of the graphic to be occupied by the navigator pane
      navLeftPercent: 0.2,             // The portion of the navigator to be occupied by the 2.4 Ghz selector
      plotMargins: {
        top: 20,
        bottom: 30,
        left: 60,
        right: 0
      },
      navMargins: {
        top: 1,
        bottom: 18,
        left: 60,
        right: 0
      }
    };

    var spanLen = utils.spanLen,
        isAllowableChannel = channelChecker.isAllowableChannel;

    var vis = (function() {
      var vis = {};

      /* Current band being displayed ('2_4' or '5'). */
      var band = undefined;

      /* Namespaces for plot elements, scales, and dimensions. */
      var elem = {}, scales = {}, dim = {};

      vis.render = function() {
        /* Scale to device screen */
        dim.width = $(window).width() * 0.95;
        dim.height = ($(window).height() - $('#top-bar').height()) * 0.95;

        buildPlot();
        buildNav();
        vis.setBand(channelTableState.band() || config.defaultBand);
      };

      /* Pull in new data and update element height */
      vis.update = function(data) {
        rescaleVertically('plot');
        rescaleVertically('navLeft');
        rescaleVertically('navRight');

        updateBars('plot', data);
        updateBars('navLeft', data);
        updateBars('navRight', data);
        updateLabels(data);
      };

      /* Store selected band and viewport location */
      vis.saveState = function() {
        var slider, extentMin, extentMax, xScale;

        slider = elem.nav.right.slider;
        xScale = scales.nav.right.x;

        extentMin = xScale.invert(parseFloat(slider.attr('x'))),
        extentMax = xScale.invert(parseFloat(slider.attr('x')) +
                                        parseFloat(slider.attr('width')));

        channelTableState.band(band);
        channelTableState.sliderExtent([extentMin, extentMax]);
      };

      /* Select the band to display.
       *
       * @param {string} newBand - Either '2_4' or '5'
       */
      vis.setBand = function(newBand) {
        if (newBand !== band) {
          if (newBand ===  '2_4') {
            elem.nav.right.clip.select('#nav-toggle-right').classed('active', false);
            elem.nav.left.clip.select('#nav-toggle-left').classed('active', true);
          } else if (newBand === '5') {
            elem.nav.left.clip.select('#nav-toggle-left').classed('active', false);
            elem.nav.right.clip.select('#nav-toggle-right').classed('active', true);
          }
          band = newBand;

          rescalePlotXAxis();
          rescalePlotElements();
          repositionPlotElements();
        }
      };

      vis.destroy = function() {
        d3.select('#plot').selectAll('*').remove();
        d3.select('#nav-left').selectAll('*').remove();
        d3.select('#nav-right').selectAll('*').remove();
      };

      /* Derive plot dimensions and add elements to DOM */
      var buildPlot = function() {
        dim.plot = {};

        /* Dimensions */
        dim.plot.totalHeight = dim.height * (1 - config.navPercent);

        dim.plot.margins = config.plotMargins;

        dim.plot.width = dim.width - dim.plot.margins.left - dim.plot.margins.right;
        dim.plot.height = dim.plot.totalHeight - dim.plot.margins.top - dim.plot.margins.bottom;

        elem.plot = {};

        /* Container */
        elem.plot.container = d3.select('#plot').classed('chart', true).append('svg')
          .attr('width', dim.width)
          .attr('height', dim.plot.totalHeight)
          .append('g')
            .attr('transform', 'translate(' + dim.plot.margins.left + ',' + dim.plot.margins.top + ')');

        /* Clip-path */
        elem.plot.clip = elem.plot.container.append('g')
          .attr('clip-path', 'url(#plot-clip)')

        elem.plot.clip.append('svg:clipPath')
          .attr('id', 'plot-clip')
          .append('rect')
          .attr('width', dim.plot.width)
          .attr('height', dim.plot.height);

        scales.plot = {};
        elem.plot.axis = {};

        /* X Axis */
        scales.plot.x = d3.scale.linear()
          .domain(config.domain2_4)
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

        /* X Label */
        elem.plot.container.append('text')
          .text(strings.channelTable.labelX)
          .attr('x', function() {
            return (dim.plot.width / 2) - (this.getBBox().width / 2);
          })
          .attr('y', dim.plot.height + dim.plot.margins.bottom - 1);

        scales.plot.y = d3.scale.linear()
          .domain(config.range)
          .range([dim.plot.height, 0]);

        elem.plot.axis.y = d3.svg.axis()
          .scale(scales.plot.y)
          .orient('left')
          .ticks(8)
          .tickSize(1);

        elem.plot.container.append('g')
          .attr('class', 'y axis')
          .call(elem.plot.axis.y);

        /* Y Label */
        elem.plot.container.append('text')
          .text(strings.channelTable.labelY)
          .attr('transform', function() {
            return 'rotate(-90) translate(-' + dim.plot.totalHeight/2 + ', -' + this.getBBox().width/2 + ')';
          });

        /* Border */
        elem.plot.container.append('rect')
          .attr('width', dim.plot.width - 1)
          .attr('height', dim.plot.height)
          .attr('stroke', 'black')
          .attr('stroke-width', '1')
          .attr('fill', 'transparent')
          .attr('pointer-events', 'none');
      };

      /* Derive navigator dimensions and add elments to DOM */
      var buildNav = function() {
        dim.nav = {};

        /* Dimensions */
        dim.nav.totalHeight = dim.height * config.navPercent;

        dim.nav.margins = config.navMargins;

        dim.nav.width = dim.width - dim.nav.margins.left - dim.nav.margins.right;
        dim.nav.height = dim.nav.totalHeight - dim.nav.margins.top - dim.nav.margins.bottom;

        scales.nav = {};

        /* Y Scale */
        scales.nav.y = d3.scale.linear()
          .domain(config.range)
          .range([dim.nav.height, 0]);

        /* 2.4 Ghz Portion */
        dim.nav.left = {};

        /* Dimensions */
        dim.nav.left.width = dim.nav.width * config.navLeftPercent;
        dim.nav.left.totalWidth = dim.nav.left.width + dim.nav.margins.left;

        elem.nav = {};
        elem.nav.left = {};

        /* Container */
        elem.nav.left.container = d3.select('#nav-left').append('svg')
          .attr('width', dim.nav.left.totalWidth)
          .attr('height', dim.nav.totalHeight)
          .append('g')
            .attr('transform', 'translate(' + dim.nav.margins.left + ',' + dim.nav.margins.top + ')');

        /* Clip-path */
        elem.nav.left.clip = elem.nav.left.container.append('g')
          .attr('clip-path', 'url(#nav-clip-left)');

        elem.nav.left.clip.append('svg:clipPath')
          .attr('id', 'nav-clip-left')
          .append('rect')
            .attr('width', dim.nav.left.width)
            .attr('height', dim.nav.height);

        scales.nav.left = {};

        /* 2.4 Ghz selector */
        elem.nav.left.clip.append('rect')
          .attr('id', 'nav-toggle-left')
          .attr('width', dim.nav.left.width)
          .attr('height', dim.nav.height)
          .on('touchstart', function() {
            d3.event.stopPropagation();
            vis.setBand('2_4')
          })

        /* X Scale */
        scales.nav.left.x = d3.scale.linear()
          .domain(config.domain2_4)
          .range([0, dim.nav.left.width]);

        /* 5 Ghz Portion */
        dim.nav.right = {};

        /* Dimensions */
        dim.nav.right.width = dim.nav.width * (1 - config.navLeftPercent);
        dim.nav.right.totalWidth = dim.nav.right.width + dim.nav.margins.right;

        elem.nav.right = {};

        /* Container */
        elem.nav.right.container = d3.select('#nav-right').append('svg')
          .attr('width', dim.nav.right.totalWidth)
          .attr('height', dim.nav.totalHeight)
          .append('g')
            .classed('navigator', true)
            .attr('transform', 'translate(0, ' + dim.nav.margins.top + ')');

        elem.nav.right.clip = elem.nav.right.container.append('g')
          .attr('clip-path', 'url(#nav-clip-right)');

        elem.nav.right.clip.append('svg:clipPath')
          .attr('id', 'nav-clip-right')
          .append('rect')
          .attr('width', dim.nav.right.width)
          .attr('height', dim.nav.height);

        scales.nav.right = {};

        scales.nav.right.x = d3.scale.linear()
          .domain(config.domain5)
          .range([0, dim.nav.right.width]);

          /* Slider */
          var touchStartX, sliderStartX;

          var onTouchStart = function() {
            d3.event.stopPropagation();

            vis.setBand('5');

            touchStartX = d3.event.changedTouches[0].screenX -
              document.getElementById('nav-right').getBoundingClientRect().left;

            sliderStartX = parseFloat(elem.nav.right.slider.attr('x'));
          };

          var onTouchMove = function() {
            var touchX, sliderX, xScale, slider;

            d3.event.stopPropagation();

            touchX = d3.event.changedTouches[0].screenX -
              document.getElementById('nav-right').getBoundingClientRect().left;

            sliderX = sliderStartX + (touchX - touchStartX);

            slider = elem.nav.right.slider;
            xScale = scales.nav.right.x;

            if (sliderX < xScale.range()[0]) {
              sliderX = xScale.range()[0];
            } else if (sliderX + parseFloat(slider.attr('width')) > xScale.range()[1]) {
              sliderX = xScale.range()[1] - parseFloat(slider.attr('width'));
            }

            slider.attr('x', sliderX);

            repositionPlotXAxis();
            repositionPlotElements();
          };

          var sliderExtent = channelTableState.sliderExtent() || config.defaultSliderExtent;

          elem.nav.right.slider = elem.nav.right.clip.append('rect')
            .attr('id', 'nav-toggle-right')
            .attr('x', function() {
              return scales.nav.right.x(sliderExtent[0]);
            })
            .attr('width', function() {
              return scales.nav.right.x(sliderExtent[1]) -
                     scales.nav.right.x(sliderExtent[0]);
            })
            .attr('height', dim.nav.height)
            .on('touchstart', onTouchStart)
            .on('touchmove', onTouchMove);

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
          .text(strings.channelGraph.label2_4)
          .attr('y', dim.nav.height + dim.nav.margins.bottom);

        elem.nav.right.container.append('text')
          .text(strings.channelGraph.label5)
          .attr('y', dim.nav.height + dim.nav.margins.bottom);
      };

      /* Get the correct bar width, in pixels, for the desired scale
       *
       * @param {d3.scale} scale - The desired scale.
       * @returns {number} - The correct bar width (px)
       */
      var barWidth = function(scale) {
        return (scale(1) - scale(0)) * config.barWidth;
      };

      /* Move plot elements to match a new viewport extent */
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

      /* Correct parabola width to account for band change */
      var rescalePlotElements = function() {
        elem.plot.clip.selectAll('.bar')
          // Assume 20 Mhz width
          .attr('width', function(d) {
            return barWidth(scales.plot.x);
          });
      };

      /* Correct X axis to account for band change */
      var rescalePlotXAxis = function() {
        repositionPlotXAxis();
        elem.plot.axis.x.ticks(spanLen(scales.plot.x.domain()));
        elem.plot.container.select('.x.axis').call(elem.plot.axis.x);
        removeDisallowedChannels();
      };

      /* "Translate" (really a rescale) x axis to account for a new viewport extent */
      var repositionPlotXAxis = function() {
        if (band === '2_4') {
          scales.plot.x.domain(config.domain2_4);
        } else if (band === '5') {
          var xScale = scales.nav.right.x,
              slider = elem.nav.right.slider;

          scales.plot.x
            .domain([xScale.invert(slider.attr('x')),
              xScale.invert(parseFloat(slider.attr('x')) +
              parseFloat(slider.attr('width')))]);
        }

        elem.plot.container.select('.x.axis').call(elem.plot.axis.x);
        removeDisallowedChannels();
      };

      /* Rescale the Y axis to bring bars which have left frame back into view */
      var rescaleVertically = function(section) {
        var container, axis, clip, yScale;

        if (section === 'plot') {
          container = elem.plot.container;
          axis = elem.plot.axis.y;
          clip = elem.plot.clip;
          yScale = scales.plot.y;
        } else if (section === 'navLeft') {
          clip = elem.nav.left.clip;
          yScale = scales.nav.y;
        } else if (section === 'navRight') {
          clip = elem.nav.right.clip;
          yScale = scales.nav.y;
        }

        var maxOccupancy = d3.max(clip.selectAll('.bar').data(), function(d) {
          return d.occupancy;
        });

        var updateElements = false;

        if (maxOccupancy >= yScale.domain()[1]) {
          yScale.domain([0, maxOccupancy * 1.125]);
          updateElements = true;
        } else if (maxOccupancy < config.range[1] * 0.875) {
          yScale.domain(config.range);
          updateElements = true;
        }

        if (updateElements) {
          if (container && axis) {
            container.select('.y.axis').call(axis);
          }

          clip.selectAll('.bar')
            .attr('height', function(d) {
              return yScale(0) - yScale(d.occupancy);
            })
            .attr('y', function(d) {
              return yScale(d.occupancy);
            });

          clip.selectAll('text')
            .attr('y', function(d) {
              return yScale(d.occupancy) - config.labelPadding
            });
        }
      };

      /* Remove tick marks from X axis which don't correspond
         to a valid channel */
      var removeDisallowedChannels = function() {
        elem.plot.container.selectAll('.x.axis > .tick')
          .filter(function(d) {
            return isAllowableChannel(d) === undefined;
          })
            .remove();

        elem.plot.container.selectAll('.x.axis > .tick')
          .filter(function(d) {
            return isAllowableChannel(d) === false;
          })
            .style('opacity', config.disallowedChannelOpacity)
            .attr('fill', config.disallowedChannelColor);
      };

      var updateBars = function(section, data) {
        var xScale, yScale, clip;

        if (section === 'plot') {
          xScale = scales.plot.x;
          yScale = scales.plot.y;
          clip = elem.plot.clip;
        } else if (section === 'navLeft') {
          xScale = scales.nav.left.x;
          yScale = scales.nav.y;
          clip = elem.nav.left.clip;
        } else if (section === 'navRight') {
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
          .attr('fill', config.barFillColor)
          .attr('stroke-width', config.barStrokeWidth)
          .attr('stroke', config.barStrokeColor)
            .transition()
            .duration(updateInterval * .8)
              .attr('height', function(d) {
                return yScale(0) - yScale(d.occupancy);
              })
              .attr('y', function(d) {
                return yScale(d.occupancy);
              });

        bars
          .transition()
          .duration(updateInterval * .8)
            .attr('y', function(d) {
              return yScale(d.occupancy);
            })
            .attr('height', function(d) {
              return yScale(0) - yScale(d.occupancy);
            });

        bars.exit()
          .transition()
          .duration(updateInterval * .8)
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
          .attr('fill', config.labelColor)
          .attr('x', function(d) {
            return scales.plot.x(d.channel) - this.getBBox().width / 2;
          })
          .attr('y', scales.plot.y(0))
          .transition()
          .duration(updateInterval * .8)
            .attr('y', function(d) {
              return scales.plot.y(d.occupancy) - config.labelPadding;
            });

        labels
          .transition()
          .duration(updateInterval * .8)
            .attr('y', function(d) {
              return scales.plot.y(d.occupancy) - config.labelPadding;
            })
            .text(function(d) {
              return d.occupancy;
            });

        labels.exit()
        .transition()
        .duration(updateInterval * .8)
          .attr('y', scales.plot.y(constants.noSignal))
          .remove();
      };

      return vis;
    })();

    var update = function() {
      if (! globalSettings.updatesPaused()) {
        accessPoints.getAll().done(function(results) {
          var numOccupants = {},
              data = [],
              accessPoint;

          for (var i = 0; i < results.length; ++i) {
            accessPoint = results[i];

            if (numOccupants[accessPoint.channel] === undefined) {
              numOccupants[accessPoint.channel] = 1;

            } else {
              numOccupants[accessPoint.channel] += 1;
            }
          }

          for (var channel in numOccupants) {
            data.push({
              channel: channel,
              occupancy: numOccupants[channel]
            });
          }

          vis.update(data);
        });
      }
    };

    var init = function() {
      vis.render();

      var firstUpdate = function() {
        update();
        document.removeEventListener(events.swipeDone, firstUpdate);
      }

      if (globalSettings.updatesPaused()) {
        document.addEventListener(events.swipeDone, firstUpdate);
      } else {
        update();
      }

      var updateLoop = setInterval(update, updateInterval);

      /* Runs on view unload */
      $scope.$on('$destroy', function() {
        clearInterval(updateLoop);

        vis.saveState();
        vis.destroy();
      });
    };

    init();

  });

}]);
