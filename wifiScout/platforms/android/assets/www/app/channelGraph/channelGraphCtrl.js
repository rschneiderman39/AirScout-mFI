"use strict";

/* Handles data updating and DOM manipulation for the channel graph
   view. */
app.controller('channelGraphCtrl', ['$scope', 'globals', 'utils', 'visBuilder',
'accessPoints', 'globalSettings', 'channelGraphState', 'channelValidator',
'setupSequence', function($scope, globals, utils, visBuilder, accessPoints,
globalSettings, channelGraphState, channelValidator, setupSequence) {

  /* Wait for app setup to complete before setting up the controller */
  setupSequence.done.then(function() {

    /* The time, in milliseconds, between data updates */
    var updateInterval = globals.updateIntervals.channelGraph;

    /* The animation duration, in milliseconds, for the bars and labels */
    var transitionInterval = updateInterval * .9;

    var prefs = {
      defaultBand: '2_4',             /* The band that is pre-selected on
                                          first view load */

      defaultSliderExtent: [34, 66],  /* The initial extent of the 5Ghz slider,
                                        in channel units, on first view load. */

      disallowedChannelOpacity: 0.35,  /* Opacity applied to the labels of
                                        restricted channels */

      domain2_4: [-1, 15],            /* The extent of the X axis for the 2.4
                                        Ghz band, in channel units */

      domain5: [34, 167],             /* The extent of the X axis for the 2.4
                                        Ghz band, in channel units */

      fillShadeFactor: 0.75,          /* Basically determines how "light" the
                                         fill shade is for the parabolas compared
                                         the outline color.  The closer to 1,
                                         the lighter the shade. */

      labelPadding: 10,               /* The number of pixels separating
                                        each parabola from its label */

      heightFactor: 0.97             /* Height of the visualization as a
                                        percentage of its container height */
    };

    function init() {
      /* This configuration object tells VisBuilder how to construct the
         skeleton components (axes, labels, containers, etc...).  Refer to
         VisBuilder comments for an explanation of each parameter. */
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

      /* Choose canvas dimensions that will fit the container */
      config.width = $('#current-view').width();
      config.height = $('#current-view').height() * prefs.heightFactor;

      /* If this is first view load, configure vis with default slider location
        and band selection.  Othersiwe, configure with the state that was
        saved on last view unload. */
      config.band = channelGraphState.band() || prefs.defaultBand;
      config.sliderExtent = channelGraphState.sliderExtent() || prefs.defaultSliderExtent;

      /* Build the visualization with the our configuration and custom
         callbacks */
      var vis = visBuilder.buildVis(elemUpdateCallback, elemScrollCallback,
        axsiScrollCallback, bandChangeCallback, saveStateCallback);

      vis.init(config);

      /* Start the data update loop */
      var updateLoop = setInterval(function() {
        if (! globalSettings.updatesPaused()) {
          vis.update();
        }
      }, updateInterval);

      /* Wait until the transition animation is done before performing
         first update */
      $scope.$on(globals.events.transitionDone, vis.update);

      /* Rescale on screen rotate */
      $scope.$on(globals.events.orientationChanged, renderFromScratch);

      /* Run cleanup on view unload */
      $scope.$on('$destroy', function() {
        /* Stop data updates */
        clearInterval(updateLoop);

        vis.saveState();
        vis.destroy();
      });

      /* Rebuild visualization from scratch with appropriate dimensions */
      function renderFromScratch() {
        config.width = $('#current-view').width();
        config.height = $('#current-view').height() * prefs.heightFactor;

        vis.destroy();
        vis.init(config);
      };
    };

    /* Invoked whenever vis.update() is called on the object returned by
       VisBuilder.  It adds, updates, and removes the parabolas and their labels.
       Refer to comments in VisBuilder for details. */
    function elemUpdateCallback(mainCanvas, mainScalesX, mainScalesY,
                                mainContainer, mainAxisFnX, mainAxisFnY,
                                navLeftCanvas, navLeftScalesX,
                                navRightCanvas, navRightScalesX,
                                navScalesY, band) {
      accessPoints.getAll().then(function(data) {
        updateParabolas(data);
        updateLabels(data);
      });

      /* Update parabola heights across the entire visualization.

         @param data - an array of AccessPoint objects
      */
      function updateParabolas(data) {
        /* Separate the 2.4 and 5 Ghz datasets */
        var data2_4Ghz = data.filter(function (d) {
          return utils.inBand(d.frequency, '2_4');
        });

        var data5Ghz = data.filter(function(d) {
          return utils.inBand(d.frequency, '5');
        });

        /* Update the main panel with the dataset corresponding to the
           selected band */
        if (band === '2_4') {
          updateSection(mainScalesX, mainScalesY, mainCanvas, data2_4Ghz);
        } else if (band === '5') {
          updateSection(mainScalesX, mainScalesY, mainCanvas, data5Ghz);
        }

        /* Update both navigation panels with the appropriate datasets */
        updateSection(navLeftScalesX, navScalesY, navLeftCanvas, data2_4Ghz);
        updateSection(navRightScalesX, navScalesY, navRightCanvas, data5Ghz);

        /* A general function for updating the parabolas in a particular section
           of the visualization.  Just pass in the appropriate scales
           and canvases.

           @param xScale - d3 scale object for section's X scale
           @param yScale - d3 scale object for section's Y scale
           @param canvas - the target svg canvas
           @param data - an array of AccessPoint objects
        */
        function updateSection(xScale, yScale, canvas, data) {
          /* Sort the data in order of increasing level.  Then, bind
             the data to existing (or not yet existing) parabolas,
             using mac address as a "key". */
          var parabolas = canvas.selectAll('.parabola')
            .data(data.sort(function(a, b) {
              return b.level - a.level;
            }), function(d) {
              return d.mac;
            });

          /* Stop any in-progress transitions */
          parabolas.interrupt();

          /* Create a parabola for each new data point */
          parabolas.enter().append('path')
            .classed('parabola', true)
            .attr('pointer-events', 'none')
            .attr('d', function(d) {
              // Start with 0 height so appearance can be animated
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

          /* Put the dom elements in the same order as the dataset. Since the
             dataset is ordered by increasing level, no parabola will be completely
             covered by another parabola */
          parabolas.order();

          /* Transition each bar to its new height */
          parabolas
            .transition()
            .duration(transitionInterval)
              .attr('d', function(d) {
                return utils.generateParabola(d.level, xScale, yScale);
              });

          /* Transition out any parabolas that no longer map to a data point */
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
        /* Bind dataset to the labels */
        var labels = mainCanvas.selectAll('text')
          .data(data.sort(function(a, b) {
            return b.level - a.level;
          }), function(d) {
            return d.mac;
          });

        /* Stop any in-progress transitions */
        labels.interrupt();

        /* Create a new label for each new data point */
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

        /* Move all labels to front, to prevent them from being covered by
          the parabolas */
        labels.each(function() {
          this.parentNode.appendChild(this);
        });

        /* Transition labels to new height */
        labels
          .transition()
          .duration(transitionInterval)
            .attr('y', function(d) {
              return mainScalesY(d.level) - prefs.labelPadding;
            });

        /* Transition out any labels that no longer map to a data point */
        labels.exit()
        .transition()
        .duration(transitionInterval)
          .attr('y', mainScalesY(globals.constants.signalFloor))
          .remove();
      };
    };

    /* Move plot elements to match a new 5Ghz slider extent.
       Called whenever the slider is moved.  Refer to comments in VisBuilder for
       details
    */
    function elemScrollCallback(mainCanvas, mainScalesX) {
      /* Move parabolas */
      mainCanvas.selectAll('.parabola')
        .attr('transform', function(d) {
          return 'translate(' + mainScalesX(d.channel) + ')';
        });

      /* Move labels */
      mainCanvas.selectAll('text')
        .attr('x', function(d) {
                                          // Make sure label is centered
          return mainScalesX(d.channel) - this.getBBox().width / 2;
        });
    };

    /* Rescale x axis to account for a new 5 Ghz slider extent. Called whenever
       slider is moved. Refer to comments in VisBuilder for details */
    function axsiScrollCallback(mainContainer, mainAxisFnX,
                          mainScalesX, slider,
                          navRightScalesX, band) {

      /* If we just switched to the 2.4 Ghz band, rescale appropriately */
      if (band === '2_4') {
        mainScalesX.domain(prefs.domain2_4);

      }
      /* Otherwise, rescale to the slider extent */
      else if (band === '5') {
        mainScalesX
          .domain([navRightScalesX.invert(slider.attr('x')),
            navRightScalesX.invert(parseFloat(slider.attr('x')) +
            parseFloat(slider.attr('width')))]);
      }

      /* Update the axis */
      mainContainer.select('.x.axis').call(mainAxisFnX);

      markRestrictedChannels(mainContainer);
    };

    /* Invoked whenever the user selects a different band.  Refer to comments
       in VisBuilder for details. */
    function bandChangeCallback(mainCanvas, mainScalesX,
                          mainContainer, mainAxisFnX,
                          slider, navRightScalesX, band) {

      /* Update the X axis to reflect the new band */
      axsiScrollCallback(mainContainer, mainAxisFnX, mainScalesX,
                         slider, navRightScalesX, band);

      /* Clear all elements from the main panel */
      mainCanvas.selectAll('.parabola').remove();
      mainCanvas.selectAll('text').remove();

      /* Make sure the X axis has enough ticks for all the channels */
      mainAxisFnX.ticks(mainScalesX.domain()[1] - mainScalesX.domain()[0]);
      mainContainer.select('.x.axis').call(mainAxisFnX);

      markRestrictedChannels(mainContainer);
    };

    /* Grey out any channel labels that represent a restricted channel.
       Remove any labels that don't correspond to a real channel  (since making
       a custom axis would be kinda hard)

       @param mainContainer - svg canvas for main section
    */
    function markRestrictedChannels(mainContainer) {
      /* Remove all channel labels that aren't actually channels */
      mainContainer.selectAll('.x.axis > .tick')
        .filter(function(d) {
          return channelValidator.isAllowableChannel(d) === undefined;
        })
          .remove();

      /* Grey out restricted channels */
      mainContainer.selectAll('.x.axis > .tick')
        .filter(function(d) {
          return channelValidator.isAllowableChannel(d) === false;
        })
          .style('opacity', prefs.disallowedChannelOpacity)
          .attr('fill', 'black');
    };

    /* Invoked whenever saveState() is called on the visualization object
       returned by VisBuilder.  Refer to VisBuidler comments for details */
    function saveStateCallback(slider, navRightScalesX, band) {
      var extentMin, extentMax;

      /* Get the current slider extent */
      extentMin = navRightScalesX.invert(parseFloat(slider.attr('x'))),
      extentMax = navRightScalesX.invert(parseFloat(slider.attr('x')) +
                                      parseFloat(slider.attr('width')));

      /* Save our current state */
      channelGraphState.band(band);
      channelGraphState.sliderExtent([extentMin, extentMax]);
    };

    init();

  });

}]);
