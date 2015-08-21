"use strict";

app.controller('channelGraphCtrl', ['$scope', 'visBuilder', 'accessPoints', 'globalSettings',
  'channelGraphState', 'channelChecker', 'setupService', function($scope,
  visBuilder, accessPoints,  globalSettings, channelGraphState, channelChecker,
  setupService) {

  setupService.ready.then(function() {

    var updateInterval = constants.updateIntervalSlow,
        transitionInterval = updateInterval * .9;

    var prefs = {
      defaultBand: '2_4',
      defaultSliderExtent: [34, 66],
      disallowedChannelColor: 'black',
      disallowedChannelOpacity: 0.35,
      domain2_4: [-1, 15],
      domain5: [34, 167],
      fillShadeFactor: 0.75,
      labelPadding: 10,
      widthFactor: 0.97,
      heightFactor: 0.95
    };

    function init() {
      var config = {
        band: undefined,
        graphDomain: prefs.domain2_4,
        graphMargins: {
          top: 10,
          bottom: 30,
          left: 50,
          right: 0
        },
        gridLineOpacity: 0.5,
        height: undefined,
        labelX: globals.strings.channelGraph.labelX,
        labelY: globals.strings.channelGraph.labelY,
        navLeftDomain: prefs.domain2_4,
        navLeftLabel: globals.strings.channelGraph.label2_4,
        navLeftPercent: 0.2,
        navMargins: {
          top: 1,
          bottom: 18,
          left: 50,
          right: 0
        },
        navPercent: 0.2,
        navRightDomain: prefs.domain5,
        navRightLabel: globals.strings.channelGraph.label5,
        range:[globalSettings.visScaleMin(), globalSettings.visScaleMax()],
        sliderExtent: undefined,
        width: undefined,
        xAxisTickInterval: 1,
        yAxisTickInterval: 10
      };

      config.width = $(window).width() * prefs.widthFactor;
      config.height = ($(window).height() - $('#top-bar').height()) * prefs.heightFactor;

      config.band = channelGraphState.band() || prefs.defaultBand;
      config.sliderExtent = channelGraphState.sliderExtent() || prefs.defaultSliderExtent;

      var vis = visBuilder.buildVis(config, elementUpdateFn, elementScrollFn,
        axisScrollFn, bandChangeFn, saveStateFn);

      document.addEventListener(events.transitionDone, onTransitionDone);

      function onTransitionDone() {
        document.removeEventListener(events.transitionDone, onTransitionDone);
        vis.update();
      };

      var updateLoop = setInterval(vis.update, updateInterval);

      $scope.$on('$destroy', function() {
        clearInterval(updateLoop);
        vis.saveState();
        d3.select('#vis').selectAll('*').remove();
      });
    };

    function elementUpdateFn(graphClip, graphScalesX, graphScalesY,
                             _ignore1, _ignore2, _ignore3,
                             navLeftClip, navLeftScalesX,
                             navRightClip, navRightScalesX,
                             navScalesY, band) {

      if (! globalSettings.updatesPaused()) {
        accessPoints.getAll().done(function(data) {
          updateParabolas(data);
          updateLabels(data);
        });
      }

      function updateParabolas(data) {
        var data2_4Ghz = data.filter(function (d) {
          return utils.inBand(d.frequency, '2_4');
        });

        var data5Ghz = data.filter(function(d) {
          return utils.inBand(d.frequency, '5');
        });

        if (band === '2_4') {
          updateSection(graphScalesX, graphScalesY, graphClip, data2_4Ghz);
        } else if (band === '5') {
          updateSection(graphScalesX, graphScalesY, graphClip, data5Ghz);
        }

        updateSection(navLeftScalesX, navScalesY, navLeftClip, data2_4Ghz);
        updateSection(navRightScalesX, navScalesY, navRightClip, data5Ghz);

        function updateSection(xScale, yScale, clip, data) {
          var parabolas = clip.selectAll('.parabola')
            .data(data.sort(function(a, b) {
              return b.level - a.level;
            }), function(d) {
              return d.mac;
            });

          parabolas.enter().append('path')
            .classed('parabola', true)
            .attr('pointer-events', 'none')
            .attr('d', function(d) {
              return utils.generateParabola(constants.signalFloor, xScale, yScale);
            })
            .attr('transform', function(d) {
              return 'translate(' + xScale(d.channel) + ')';
            })
            .attr('stroke', function(d) {
              return d.color
            })
            .attr('fill', function(d) {
              return utils.toLighterShade(d.color, prefs.fillShadeFactor);
            })
            .attr('stroke-width', 2);

          parabolas.order();

          parabolas
            .transition()
            .duration(transitionInterval)
              .attr('d', function(d) {
                return utils.generateParabola(d.level, xScale, yScale);
              });

          parabolas.exit()
            .transition()
            .duration(transitionInterval)
              .attr('d', function(d) {
                return utils.generateParabola(constants.signalFloor, xScale, yScale);
              })
              .remove();
        };
      };

      function updateLabels(data) {
        /* Bind new data */
        var labels = graphClip.selectAll('text')
          .data(data.sort(function(a, b) {
            return b.level - a.level;
          }), function(d) {
            return d.mac;
          });

        labels.interrupt();

        /* Add new labels where necessary */
        labels.enter().append('text')
          .text(function(d) {
            return d.ssid !== globals.strings.hiddenSSID ? d.ssid : "";
          })
          .attr('fill', function(d) {
            return d.color;
          })
          .attr('x', function(d) {
            return graphScalesX(d.channel) - this.getBBox().width / 2;
          })
          .attr('y', graphScalesY(constants.signalFloor))

        labels.order();

        /* Move all labels to front */
        labels.each(function() {
          this.parentNode.appendChild(this);
        });

        /* Update existing labels */
        labels
          .transition()
          .duration(transitionInterval)
            .attr('y', function(d) {
              return graphScalesY(d.level) - prefs.labelPadding;
            });

        /* Remove labels that no longer belong to any data */
        labels.exit()
        .transition()
        .duration(transitionInterval)
          .attr('y', graphScalesY(constants.signalFloor))
          .remove();
      };
    };

    /* Move plot elements to match a new viewport extent */
    function elementScrollFn(graphClip, graphScalesX) {
      /* Move parabolas */
      graphClip.selectAll('.parabola')
        .attr('transform', function(d) {
          return 'translate(' + graphScalesX(d.channel) + ')';
        });

      /* Move labels */
      graphClip.selectAll('text')
        .attr('x', function(d) {
          return graphScalesX(d.channel) - this.getBBox().width / 2;
        });
    };

    /* "Translate" x axis to account for a new slider extent */
    function axisScrollFn(graphContainer, graphAxisFnX,
                          graphScalesX, navRightSlider,
                          navRightScalesX, band) {

      if (band === '2_4') {
        graphScalesX.domain(prefs.domain2_4);

      } else if (band === '5') {
        var xScale = navRightScalesX,
            slider = navRightSlider;

        graphScalesX
          .domain([xScale.invert(slider.attr('x')),
            xScale.invert(parseFloat(slider.attr('x')) +
            parseFloat(slider.attr('width')))]);
      }

      graphContainer.select('.x.axis').call(graphAxisFnX);

      markDisallowedChannels(graphContainer);
    };

    function bandChangeFn(graphClip, graphScalesX,
                          graphContainer, graphAxisFnX,
                          navRightSlider, navRightScalesX, band) {

      axisScrollFn(graphContainer, graphAxisFnX, graphScalesX,
                   navRightSlider, navRightScalesX, band);

      elementScrollFn(graphClip, graphScalesX, band);

      graphClip.selectAll('.parabola').remove();
      graphClip.selectAll('text').remove();

      graphAxisFnX.ticks(utils.spanLen(graphScalesX.domain()));
      graphContainer.select('.x.axis').call(graphAxisFnX);

      markDisallowedChannels(graphContainer);
    };

    /* Remove tick marks from X axis which don't correspond
       to a valid channel */
    function markDisallowedChannels(graphContainer) {
      graphContainer.selectAll('.x.axis > .tick')
        .filter(function(d) {
          return channelChecker.isAllowableChannel(d) === undefined;
        })
          .remove();

      graphContainer.selectAll('.x.axis > .tick')
        .filter(function(d) {
          return channelChecker.isAllowableChannel(d) === false;
        })
          .style('opacity', prefs.disallowedChannelOpacity)
          .attr('fill', prefs.disallowedChannelColor);
    };

    function saveStateFn(navRightSlider, navRightScalesX, band) {
      var slider, extentMin, extentMax, xScale;

      slider = navRightSlider;
      xScale = navRightScalesX;

      extentMin = xScale.invert(parseFloat(slider.attr('x'))),
      extentMax = xScale.invert(parseFloat(slider.attr('x')) +
                                      parseFloat(slider.attr('width')));

      channelGraphState.band(band);
      channelGraphState.sliderExtent([extentMin, extentMax]);
    };

    init();

  });

}]);
