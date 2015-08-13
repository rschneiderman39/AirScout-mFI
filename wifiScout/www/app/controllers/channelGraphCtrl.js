/* Controller for the channel graph view. */
app.controller('channelGraphCtrl', ['$scope', 'accessPoints', 'globalSettings',
  'channelGraphState', 'channelChecker', 'setupService', function($scope,
  accessPoints, globalSettings, channelGraphState, channelChecker, setupService) {

  setupService.ready.then(function() {

    var updateInterval = constants.updateIntervalSlow,
        transitionInterval = updateInterval * .9;

    var config = {
      defaultBand: '2_4',              // Band shown on first view open ('2_4' or '5')
      domain2_4: [-1, 15],             // X-scale for 2.4 Ghz band
      domain5: [34, 167],              // X-scale for 5 Ghz band
      range: [constants.noSignal, constants.maxSignal],  // Y-scale for level
      defaultSliderExtent: [34, 66], // 5Ghz nav viewport extent on first view open
      fillShadeFactor: 0.75,           // [0,...1] Determines how light the fill shade is
      labelPadding: 10,                // Pixels between parabola top and label bottom
      gridLineOpacity: 0.5,
      yAxisTickInterval: 10,
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
        toLighterShade = utils.toLighterShade,
        isAllowableChannel = channelChecker.isAllowableChannel,
        generateParabola = utils.generateParabola,
        accessPointSubset = utils.accessPointSubset;

    var selectedMACs = [],
        showAll = true;

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
        vis.setBand(channelGraphState.band() || config.defaultBand);
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

          elem.plot.clip.selectAll('.parabola').remove();
          elem.plot.clip.selectAll('text').remove();

          rescalePlotXAxis();
          repositionPlotElements();
          vis.update();
        }
      };

      /* Store selected band and viewport location */
      vis.saveState = function() {
        var slider, extentMin, extentMax, xScale;

        slider = elem.nav.right.slider;
        xScale = scales.nav.right.x;

        extentMin = xScale.invert(parseFloat(slider.attr('x'))),
        extentMax = xScale.invert(parseFloat(slider.attr('x')) +
                                        parseFloat(slider.attr('width')));

        channelGraphState.band(band);
        channelGraphState.sliderExtent([extentMin, extentMax]);
      };

      /* Pull in new data and update element height */
      vis.update = function() {
        if (! globalSettings.updatesPaused()) {
          accessPoints.getAllInBand('2_4').done(function(data) {
            var selectedData;

            if (showAll) {
              selectedData = data;
            } else {
              selectedData = accessPointSubset(data, selectedMACs);
            }

            if (band === '2_4') {
              updateParabolas('plot', selectedData);
              updateLabels(selectedData);
            }

            updateParabolas('navLeft', selectedData);
          });

          accessPoints.getAllInBand('5').done(function(data) {
            var selectedData;

            if (showAll) {
              selectedData = data;
            } else {
              selectedData = accessPointSubset(data, selectedMACs);
            }

            if (band === '5') {
              updateParabolas('plot', selectedData);
              updateLabels(selectedData);
            }

            updateParabolas('navRight', selectedData);
          });
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
          .text(strings.channelGraph.labelX)
          .attr('x', function() {
            return (dim.plot.width / 2) - (this.getBBox().width / 2);
          })
          .attr('y', dim.plot.height + dim.plot.margins.bottom - 1);

        /* Y Axis */
        var numTicks_yAxis = spanLen(config.range) / config.yAxisTickInterval + 1;

        scales.plot.y = d3.scale.linear()
          .domain(config.range)
          .range([dim.plot.height, 0]);

        elem.plot.axis.y = d3.svg.axis()
          .scale(scales.plot.y)
          .orient('left')
          .ticks(numTicks_yAxis)
          .tickSize(1);

        elem.plot.container.append('g')
          .attr('class', 'y axis')
          .call(elem.plot.axis.y);

        /* Y Label */
        elem.plot.container.append('text')
          .text(strings.channelGraph.labelY)
          .attr('transform', function() {
            return 'rotate(-90) translate(-' + dim.plot.totalHeight/2 + ', -' + this.getBBox().width/2 + ')';
          });

        /* Grid lines */
        for (var i = 1; i < numTicks_yAxis; ++i) {
          elem.plot.clip.append('path')
            .attr('stroke', 'black')
            .style('opacity', config.gridLineOpacity)
            .attr('d', function() {
              var y = scales.plot.y(config.range[0] + i * config.yAxisTickInterval);
              return 'M 0 ' + y + ' H ' + dim.plot.width + ' ' + y;
            });
        }

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
          .attr('clip-path', 'url(#nav-clip-left)')

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
            vis.setBand('2_4');
          });

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

        var sliderExtent = channelGraphState.sliderExtent() || config.defaultSliderExtent;

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

      /* Move plot elements to match a new viewport extent */
      var repositionPlotElements = function() {
        /* Move parabolas */
        elem.plot.clip.selectAll('.parabola')
          .attr('transform', function(d) {
            return 'translate(' + scales.plot.x(d.channel) + ')';
          });

        /* Move labels */
        elem.plot.clip.selectAll('text')
          .attr('x', function(d) {
            return scales.plot.x(d.channel) - this.getBBox().width / 2;
          });
      };

      /* Correct X axis to account for band change */
      var rescalePlotXAxis = function() {
        repositionPlotXAxis();

        elem.plot.axis.x.ticks(spanLen(scales.plot.x.domain()));
        elem.plot.container.select('.x.axis').call(elem.plot.axis.x);

        removeDisallowedChannels();
      };

      /* "Translate" x axis to account for a new slider extent */
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

      /* Update labels to account for new data.
       *
       * @param {Array.<APData>} data - the new dataset.
       */
      var updateLabels = function(data) {
        /* Bind new data */
        var labels = elem.plot.clip.selectAll('text')
          .data(data.sort(function(a, b) {
            return b.level - a.level;
          }), function(d) {
            return d.MAC;
          });

        labels.interrupt();

        /* Add new labels where necessary */
        labels.enter().append('text')
          .text(function(d) {
            return d.SSID !== "<hidden>" ? d.SSID : "";
          })
          .attr('fill', function(d) {
            return d.color;
          })
          .attr('x', function(d) {
            return scales.plot.x(d.channel) - this.getBBox().width / 2;
          })
          .attr('y', scales.plot.y(constants.noSignal))

        labels.order();

        /* Update existing labels */
        labels
          .transition()
          .duration(transitionInterval)
            .attr('y', function(d) {
              return scales.plot.y(d.level) - config.labelPadding;
            });

        /* Remove labels that no longer belong to any data */
        labels.exit()
        .transition()
        .duration(transitionInterval)
          .attr('y', scales.plot.y(constants.noSignal))
          .remove();
      };

      /* Update parabolas to account for new data.
       *
       * @param {string} section - The portion of the view in which to update
       *    the parabolas ('plot', 'navLeft', or 'navRight').
       * @param {Array.<APData>} data - the new dataset.
       */
      var updateParabolas = function(section, data) {
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

        /* Bind new data */
        var parabolas = clip.selectAll('.parabola')
          .data(data.sort(function(a, b) {
            return b.level - a.level;
          }), function(d) {
            return d.MAC;
          });

        parabolas.enter().append('path')
          .classed('parabola', true)
          .attr('pointer-events', 'none')
          .attr('d', function(d) {
            return generateParabola(constants.noSignal, xScale, yScale);
          })
          .attr('transform', function(d) {
            return 'translate(' + xScale(d.channel) + ')';
          })
          .attr('stroke', function(d) {
            return d.color
          })
          .attr('fill', function(d) {
            return toLighterShade(d.color, config.fillShadeFactor);
          })
          .attr('stroke-width', 2);

        parabolas.order();

        parabolas
          .transition()
          .duration(transitionInterval)
            .attr('d', function(d) {
              return generateParabola(d.level, xScale, yScale);
            });

        parabolas.exit()
          .transition()
          .duration(transitionInterval)
            .attr('d', function(d) {
              return generateParabola(constants.noSignal, xScale, yScale);
            })
            .remove();
      };

      return vis;
    })();

    var updateSelection = function() {
      var selection = globalSettings.getAccessPointSelection('channelGraph');
      selectedMACs = selection.macAddrs;
      showAll = selection.showAll;
    };

    var init = function() {
      vis.render();

      updateSelection();

      var firstUpdate = function() {
        vis.update();
        document.removeEventListener(events.swipeDone, firstUpdate);
      }

      if (globalSettings.updatesPaused()) {
        document.addEventListener(events.swipeDone, firstUpdate);
      } else {
        vis.update();
      }

      var updateLoop = setInterval(vis.update, updateInterval);

      document.addEventListener(events.newAccessPointSelection['channelGraph'], updateSelection);

      /* Runs on view unload */
      $scope.$on('$destroy', function() {
        clearInterval(updateLoop);
        document.removeEventListener(events.newAccessPointSelection['channelGraph'], updateSelection);

        vis.saveState();
        vis.destroy();
      });
    };

    init();

  });
}]);
