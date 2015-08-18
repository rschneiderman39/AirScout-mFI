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
    };

    var selectedMACs = [],
        showAll = true;

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
        gridLineOpacity: 0.5,
        height: undefined,
        labelX: strings.channelGraph.labelX,
        labelY: strings.channelGraph.labelY,
        navLeftDomain: prefs.domain2_4,
        navLeftLabel: strings.channelGraph.label2_4,
        navLeftPercent: 0.2,
        navMargins: {
          top: 1,
          bottom: 18,
          left: 60,
          right: 0
        },
        navPercent: 0.2,
        navRightDomain: prefs.domain5,
        navRightLabel: strings.channelGraph.label5,
        range:[constants.noSignal, constants.maxSignal],
        sliderExtent: undefined,
        width: undefined,
        xAxisTickInterval: 1,
        yAxisTickInterval: 10
      };

      config.width = $(window).width() * 0.95;
      config.height = ($(window).height() - $('#top-bar').height()) * 0.95;

      config.band = channelGraphState.band() || prefs.defaultBand;
      config.sliderExtent = channelGraphState.sliderExtent() || prefs.defaultSliderExtent;

      var vis = visBuilder.buildVis(config, elementUpdateFn, elementScrollFn,
        axisScrollFn, bandChangeFn, visDestructor);

      if (globalSettings.updatesPaused()) {
        document.addEventListener(events.swipeDone, firstUpdate);
      }

      var updateLoop = setInterval(vis.update, updateInterval);
      document.addEventListener(events.newAccessPointSelection['channelGraph'], updateSelection);

      $scope.$on('$destroy', function() {
        clearInterval(updateLoop);
        document.removeEventListener(events.newAccessPointSelection['channelGraph'], updateSelection);

        vis.destroy();
      });

      function firstUpdate() {
        vis.update();
        document.removeEventListener(events.swipeDone, firstUpdate);
      };
    };

    function updateSelection() {
      var selection = globalSettings.getAccessPointSelection('channelGraph');
      selectedMACs = selection.macAddrs;
      showAll = selection.showAll;
    };

    function elementUpdateFn(scales, elem, band) {
      if (! globalSettings.updatesPaused()) {
        accessPoints.getAll().done(function(data) {
          var selectedData;

          if (showAll) {
            selectedData = data;
          } else {
            selectedData = utils.accessPointSubset(data, selectedMACs);
          }

          updateParabolas(selectedData);
          updateLabels(selectedData);
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
          updateSection(scales.graph.x, scales.graph.y, elem.graph.clip, data2_4Ghz);
        } else if (band === '5') {
          updateSection(scales.graph.x, scales.graph.y, elem.graph.clip, data5Ghz);
        }

        updateSection(scales.nav.left.x, scales.nav.y, elem.nav.left.clip, data2_4Ghz);
        updateSection(scales.nav.right.x, scales.nav.y, elem.nav.right.clip, data5Ghz);

        function updateSection(xScale, yScale, clip, data) {
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
              return utils.generateParabola(constants.noSignal, xScale, yScale);
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
                return utils.generateParabola(constants.noSignal, xScale, yScale);
              })
              .remove();
        };
      };

      function updateLabels(data) {
        /* Bind new data */
        var labels = elem.graph.clip.selectAll('text')
          .data(data.sort(function(a, b) {
            return b.level - a.level;
          }), function(d) {
            return d.MAC;
          });

        labels.interrupt();

        /* Add new labels where necessary */
        labels.enter().append('text')
          .text(function(d) {
            return d.SSID !== strings.hiddenSSID ? d.SSID : "";
          })
          .attr('fill', function(d) {
            return d.color;
          })
          .attr('x', function(d) {
            return scales.graph.x(d.channel) - this.getBBox().width / 2;
          })
          .attr('y', scales.graph.y(constants.noSignal))

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
              return scales.graph.y(d.level) - prefs.labelPadding;
            });

        /* Remove labels that no longer belong to any data */
        labels.exit()
        .transition()
        .duration(transitionInterval)
          .attr('y', scales.graph.y(constants.noSignal))
          .remove();
      };
    };

    /* Move plot elements to match a new viewport extent */
    function elementScrollFn(scales, elem) {
      /* Move parabolas */
      elem.graph.clip.selectAll('.parabola')
        .attr('transform', function(d) {
          return 'translate(' + scales.graph.x(d.channel) + ')';
        });

      /* Move labels */
      elem.graph.clip.selectAll('text')
        .attr('x', function(d) {
          return scales.graph.x(d.channel) - this.getBBox().width / 2;
        });
    };

    /* "Translate" x axis to account for a new slider extent */
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

      markDisallowedChannels(elem);
    };

    function bandChangeFn(scales, elem, band) {
      axisScrollFn(scales, elem, band);
      elementScrollFn(scales, elem, band);

      elem.graph.clip.selectAll('.parabola').remove();
      elem.graph.clip.selectAll('text').remove();

      elem.graph.axisFn.x.ticks(utils.spanLen(scales.graph.x.domain()));
      elem.graph.container.select('.x.axis').call(elem.graph.axisFn.x);

      markDisallowedChannels(elem);
    };

    /* Remove tick marks from X axis which don't correspond
       to a valid channel */
    function markDisallowedChannels(elem) {
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

      channelGraphState.band(band);
      channelGraphState.sliderExtent([extentMin, extentMax]);
    };

    init();

  });

}]);
