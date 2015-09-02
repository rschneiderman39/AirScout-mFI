"use strict";

app.controller('channelGraphCtrl', ['$scope', 'globals', 'utils', 'visBuilder',
'accessPoints', 'globalSettings', 'channelGraphState', 'channelValidator',
'setupSequence', function($scope, globals, utils, visBuilder, accessPoints,
globalSettings, channelGraphState, channelValidator, setupSequence) {

  setupSequence.done.then(function() {

    var updateInterval = globals.constants.updateIntervalSlow,
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
      heightFactor: 0.97
    };

    function init() {
      var config = {
        band: undefined,
        mainDomain: prefs.domain2_4,
        mainMargins: {
          top: 10,
          bottom: 30,
          left: 55,
          right: 10
        },
        gridLineOpacity: 0.5,
        height: undefined,
        labelX: globals.strings.channelGraph.labelX,
        labelY: globals.strings.channelGraph.labelY,
        navLeftDomain: prefs.domain2_4,
        navLeftLabel: globals.strings.channelGraph.label2_4,
        navLeftPercent: 0.2,
        navMargins: {
          top: 10,
          bottom: 20,
          left: 50,
          right: 10
        },
        navPercent: 0.2,
        navRightDomain: prefs.domain5,
        navRightLabel: globals.strings.channelGraph.label5,
        range:[globalSettings.visScaleMin(), globalSettings.visScaleMax()],
        sliderExtent: undefined,
        width: undefined,
        xAxisTickInterval: 1,
        yAxisTickInterval: 10,
        canvasSelector: '#vis'
      };

      config.width = $('#current-view').width();
      config.height = $('#current-view').height() * prefs.heightFactor;

      config.band = channelGraphState.band() || prefs.defaultBand;
      config.sliderExtent = channelGraphState.sliderExtent() || prefs.defaultSliderExtent;

      var vis = visBuilder.buildVis(elemUpdateCallback, elemScrollCallback,
        axsiScrollCallback, bandChangeCallback, saveStateCallback);

      vis.init(config);

      var updateLoop = setInterval(function() {
        if (! globalSettings.updatesPaused()) {
          vis.update();
        }
      }, updateInterval);

      $scope.$on(globals.events.transitionDone, vis.update);

      /* Rescale on screen rotate */
      $(window).on('resize', redraw);

      /* Run cleanup on view unload */
      $scope.$on('$destroy', function() {
        /* Avoid duplicate event handlers */
        $(window).off('resize', redraw);

        /* Stop updating */
        clearInterval(updateLoop);

        vis.saveState();
        vis.destroy();
      });

      /* Rebuild visualization from scratch with appropriate dimensions */
      function redraw(){
        if (globals.debug) console.log('resizing channel graph');

        config.width = $('#current-view').width();
        config.height = $('#current-view').height() * prefs.heightFactor;

        vis.destroy();
        vis.init(config);
      };
    };

    function elemUpdateCallback(mainClip, mainScalesX, mainScalesY,
                             _ignore1, _ignore2, _ignore3,
                             navLeftClip, navLeftScalesX,
                             navRightClip, navRightScalesX,
                             navScalesY, band) {
      if (globals.debug) console.log('updating channel graph');

      accessPoints.getAll().then(function(data) {
        updateParabolas(data);
        updateLabels(data);
      });

      function updateParabolas(data) {
        var data2_4Ghz = data.filter(function (d) {
          return utils.inBand(d.frequency, '2_4');
        });

        var data5Ghz = data.filter(function(d) {
          return utils.inBand(d.frequency, '5');
        });

        if (band === '2_4') {
          updateSection(mainScalesX, mainScalesY, mainClip, data2_4Ghz);
        } else if (band === '5') {
          updateSection(mainScalesX, mainScalesY, mainClip, data5Ghz);
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

          parabolas.interrupt();

          parabolas.enter().append('path')
            .classed('parabola', true)
            .attr('pointer-events', 'none')
            .attr('d', function(d) {
              return utils.generateParabola(globals.constants.signalFloor, xScale, yScale);
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
                return utils.generateParabola(globals.constants.signalFloor, xScale, yScale);
              })
              .remove();
        };
      };

      function updateLabels(data) {
        /* Bind new data */
        var labels = mainClip.selectAll('text')
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
            return mainScalesX(d.channel) - this.getBBox().width / 2;
          })
          .attr('y', mainScalesY(globals.constants.signalFloor))

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
              return mainScalesY(d.level) - prefs.labelPadding;
            });

        /* Remove labels that no longer belong to any data */
        labels.exit()
        .transition()
        .duration(transitionInterval)
          .attr('y', mainScalesY(globals.constants.signalFloor))
          .remove();
      };
    };

    /* Move plot elements to match a new viewport extent */
    function elemScrollCallback(mainClip, mainScalesX) {
      /* Move parabolas */
      mainClip.selectAll('.parabola')
        .attr('transform', function(d) {
          return 'translate(' + mainScalesX(d.channel) + ')';
        });

      /* Move labels */
      mainClip.selectAll('text')
        .attr('x', function(d) {
          return mainScalesX(d.channel) - this.getBBox().width / 2;
        });
    };

    /* "Translate" x axis to account for a new slider extent */
    function axsiScrollCallback(mainContainer, mainAxisFnX,
                          mainScalesX, slider,
                          navRightScalesX, band) {

      if (band === '2_4') {
        mainScalesX.domain(prefs.domain2_4);

      } else if (band === '5') {
        var xScale = navRightScalesX,
            slider = slider;

        mainScalesX
          .domain([xScale.invert(slider.attr('x')),
            xScale.invert(parseFloat(slider.attr('x')) +
            parseFloat(slider.attr('width')))]);
      }

      mainContainer.select('.x.axis').call(mainAxisFnX);

      markDisallowedChannels(mainContainer);
    };

    function bandChangeCallback(mainClip, mainScalesX,
                          mainContainer, mainAxisFnX,
                          slider, navRightScalesX, band) {

      axsiScrollCallback(mainContainer, mainAxisFnX, mainScalesX,
                   slider, navRightScalesX, band);

      elemScrollCallback(mainClip, mainScalesX, band);

      mainClip.selectAll('.parabola').remove();
      mainClip.selectAll('text').remove();

      mainAxisFnX.ticks(mainScalesX.domain()[1] - mainScalesX.domain()[0]);
      mainContainer.select('.x.axis').call(mainAxisFnX);

      markDisallowedChannels(mainContainer);
    };

    /* Remove tick marks from X axis which don't correspond
       to a valid channel */
    function markDisallowedChannels(mainContainer) {
      mainContainer.selectAll('.x.axis > .tick')
        .filter(function(d) {
          return channelValidator.isAllowableChannel(d) === undefined;
        })
          .remove();

      mainContainer.selectAll('.x.axis > .tick')
        .filter(function(d) {
          return channelValidator.isAllowableChannel(d) === false;
        })
          .style('opacity', prefs.disallowedChannelOpacity)
          .attr('fill', prefs.disallowedChannelColor);
    };

    function saveStateCallback(slider, navRightScalesX, band) {
      var slider, extentMin, extentMax, xScale;

      slider = slider;
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
