app.controller('channelTableCtrl', ['$scope', 'visBuilder', 'accessPoints', 'globalSettings',
  'channelTableState', 'channelChecker', 'setupService', function($scope,
  visBuilder, accessPoints, globalSettings, channelTableState, channelChecker,
  setupService) {

  setupService.ready.then(function() {

    var updateInterval = constants.updateIntervalSlow,
        transitionInterval = updateInterval * .9;

    var prefs = {
      barStrokeWidth: 0,
      barStrokeColor: 'none',
      barFillColor: '#62BF01',
      barWidth: 0.8,
      defaultBand: '2_4',
      defaultSliderExtent: [34, 66],
      disallowedChannelColor: 'black',
      disallowedChannelOpacity: 0.35,
      domain2_4: [-1, 15],
      domain5: [34, 167],
      labelColor: 'black',
      labelPadding: 10,
      range: [0, 15]
    };

    function init() {
      var config = {
        band: undefined,
        graphDomain: prefs.domain2_4,
        graphMargins: {
          top: 20,
          bottom: 30,
          left: 60,
          right: 0
        },
        gridLineOpacity: 0,
        height: undefined,
        labelX: strings.channelTable.labelX,
        labelY: strings.channelTable.labelY,
        navLeftDomain: prefs.domain2_4,
        navLeftLabel: strings.channelTable.label2_4,
        navLeftPercent: 0.2,
        navMargins: {
          top: 1,
          bottom: 18,
          left: 60,
          right: 0
        },
        navPercent: 0.2,
        navRightDomain: prefs.domain5,
        navRightLabel: strings.channelTable.label5,
        range: prefs.range,
        sliderExtent: undefined,
        width: undefined,
        xAxisTickInterval: 1,
        yAxisTickInterval: 3
      };

      config.width = $(window).width() * 0.95;
      config.height = ($(window).height() - $('#top-bar').height()) * 0.95;

      config.band = channelTableState.band() || prefs.defaultBand;
      config.sliderExtent = channelTableState.sliderExtent() || prefs.defaultSliderExtent;

      var vis = visBuilder.buildVis(config, elementUpdateFn, elementScrollFn,
        axisScrollFn, bandChangeFn, visDestructor);

      if (globalSettings.updatesPaused()) {
        document.addEventListener(events.swipeDone, firstUpdate);
      }

      var updateLoop = setInterval(vis.update, updateInterval);

      $scope.$on('$destroy', function() {
        clearInterval(updateLoop);

        vis.destroy();
      });

      function firstUpdate() {
        vis.update();
        document.removeEventListener(events.swipeDone, firstUpdate);
      };
    };

    function elementUpdateFn(scales, elem, band) {
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

          rescaleVertically(data);
          updateBars(data);
          updateLabels(data);
        });
      }

      function updateBars(data) {
        updateSection(scales.graph.x, scales.graph.y, elem.graph.clip, data);
        updateSection(scales.nav.left.x, scales.nav.y, elem.nav.left.clip, data);
        updateSection(scales.nav.right.x, scales.nav.y, elem.nav.right.clip, data);

        function updateSection(xScale, yScale, clip, data) {
          var bars = clip.selectAll('.bar')
            .data(data, function(d) {
              return d.channel;
            });

          bars.enter().append('rect')
            .classed('bar', true)
            .attr('width', barWidth(xScale))
            .attr('height', 0)
            .attr('x', function(d) {
              return xScale(d.channel);
            })
            .attr('transform', function(d) {
              return 'translate(-' + (barWidth(xScale) / 2) + ')';
            })
            .attr('y', yScale(0))
            .attr('fill', prefs.barFillColor)
            .attr('stroke-width', prefs.barStrokeWidth)
            .attr('stroke', prefs.barStrokeColor);

          bars
            .interrupt()
            .transition()
            .duration(transitionInterval)
              .attr('y', function(d) {
                return yScale(d.occupancy);
              })
              .attr('height', function(d) {
                return yScale(0) - yScale(d.occupancy);
              });

          bars.exit()
            .transition()
            .duration(transitionInterval)
              .attr('y', yScale(0))
              .remove();
        };
      };

      function updateLabels(data) {
        var labels = elem.graph.clip.selectAll('text')
          .data(data, function(d) {
            return d.channel;
          });

        labels.enter().append('text')
          .text(function(d) {
            return d.occupancy;
          })
          .attr('fill', prefs.labelColor)
          .attr('x', function(d) {
            return scales.graph.x(d.channel);
          })
          .attr('transform', function(d) {
            return 'translate(-' + (this.getBBox().width / 2) + ')';
          })
          .attr('y', scales.graph.y(0))

        labels
          .interrupt()
          .transition()
          .duration(transitionInterval)
            .attr('y', function(d) {
              return scales.graph.y(d.occupancy) - prefs.labelPadding;
            })
            .text(function(d) {
              return d.occupancy;
            });

        labels.exit()
        .transition()
        .duration(transitionInterval)
          .attr('y', scales.graph.y(constants.noSignal))
          .remove();
      };

      /* Rescale the Y axis to bring bars which have left frame back into view */
      function rescaleVertically(data) {
        var maxOccupancy = d3.max(data, function(d) {
          return d.occupancy;
        });

        rescaleSection(elem.graph.container, elem.graph.axisFn.y,
                       elem.graph.clip, scales.graph.y);
        rescaleSection(null, null, elem.nav.left.clip, scales.nav.y);
        rescaleSection(null, null, elem.nav.right.clip, scales.nav.y);

        function rescaleSection(container, axisFn, clip, yScale) {
          var rescaleNeeded = false;

          if (maxOccupancy >= yScale.domain()[1]) {
            yScale.domain([0, maxOccupancy * 1.125]);
            rescaleNeeded = true;
          } else if (maxOccupancy < prefs.range[1] * 0.875) {
            yScale.domain(prefs.range);
            rescaleNeeded = true;
          }

          if (rescaleNeeded) {
            if (container && axisFn) {
              container.select('.y.axis').call(axisFn);
            }

            clip.selectAll('.bar')
              .interrupt()
              .attr('height', function(d) {
                return yScale(0) - yScale(d.occupancy);
              })
              .attr('y', function(d) {
                return yScale(d.occupancy);
              })

            clip.selectAll('text')
              .interrupt()
              .attr('y', function(d) {
                return yScale(d.occupancy) - prefs.labelPadding;
              })
          }
        };

      };

    };

    function barWidth(scale) {
      return (scale(1) - scale(0)) * prefs.barWidth;
    };

    /* Move plot elements to match a new viewport extent */
    function elementScrollFn(scales, elem) {
      /* Move parabolas */
      elem.graph.clip.selectAll('.bar')
        .attr('x', function(d) {
          return scales.graph.x(d.channel);
        });

      /* Move labels */
      elem.graph.clip.selectAll('text')
        .attr('x', function(d) {
          return scales.graph.x(d.channel);
        });
    };

    /* "Translate" (really a rescale) x axis to account for a new viewport extent */
    function axisScrollFn(scales, elem, band) {
      if (band === '2_4') {
        scales.graph.x.domain(prefs.domain2_4);
      } else if (band === '5') {
        var xScale = scales.nav.right.x,
            slider = elem.nav.right.slider;

        scales.graph.x
          .domain([xScale.invert(slider.attr('x')),
            xScale.invert(parseFloat(slider.attr('x')) +
            parseFloat(slider.attr('width')))]);
      }

      elem.graph.container.select('.x.axis').call(elem.graph.axisFn.x);

      removeDisallowedChannels(elem);
    };

    function bandChangeFn(scales, elem, band) {
      axisScrollFn(scales, elem, band);
      elementScrollFn(scales, elem, band);

      elem.graph.clip.selectAll('.bar')
        .attr('width', function(d) {
          return barWidth(scales.graph.x);
        })
        .attr('transform', function(d) {
          return 'translate(-' + (barWidth(scales.graph.x) / 2) + ')';
        });

      elem.graph.clip.selectAll('text')
        .attr('transform', function(d) {
          return 'translate(-' + (this.getBBox().width / 2) + ')';
        });

      elem.graph.axisFn.x.ticks(utils.spanLen(scales.graph.x.domain()));
      elem.graph.container.select('.x.axis').call(elem.graph.axisFn.x);

      removeDisallowedChannels(elem);
    };

    /* Remove tick marks from X axis which don't correspond
       to a valid channel */
    function removeDisallowedChannels(elem) {
      elem.graph.container.selectAll('.x.axis > .tick')
        .filter(function(d) {
          return channelChecker.isAllowableChannel(d) === undefined;
        })
          .remove();

      elem.graph.container.selectAll('.x.axis > .tick')
        .filter(function(d) {
          return channelChecker.isAllowableChannel(d) === false;
        })
          .style('opacity', prefs.disallowedChannelOpacity)
          .attr('fill', prefs.disallowedChannelColor);
    };

    function visDestructor(scales, elem, band) {
      var slider, extentMin, extentMax, xScale;

      slider = elem.nav.right.slider;
      xScale = scales.nav.right.x;

      extentMin = xScale.invert(parseFloat(slider.attr('x'))),
      extentMax = xScale.invert(parseFloat(slider.attr('x')) +
                                      parseFloat(slider.attr('width')));

      channelTableState.band(band);
      channelTableState.sliderExtent([extentMin, extentMax]);
    };

    init();

  });

}]);
