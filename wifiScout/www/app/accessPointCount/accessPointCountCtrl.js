"use strict";

/* Handles data updating and DOM manipulation for the access point count
   view. */
app.controller('accessPointCountCtrl', ['$scope', 'globals', 'visBuilder',
'accessPoints', 'globalSettings', 'accessPointCountState', 'channelValidator',
'setupSequence', function($scope, globals, visBuilder, accessPoints,
globalSettings, accessPointCountState, channelValidator, setupSequence) {

  /* Wait for app setup to complete before setting up the controller */
  setupSequence.done.then(function() {

    /* The time, in milliseconds, between data updates */
    var updateInterval = globals.updateIntervals.accessPointCount;

    /* The animation duration, in milliseconds, for the bars and labels */
    var transitionInterval = updateInterval * .9;

    var prefs = {
      barStrokeWidth: 0,               // Bar border width, in pixels
      barStrokeColor: 'none',          // Bar border color
      barFillColor: '#62BF01',         // Bar color

      barWidth: 0.8,                   /* Bar width percent.  A width of 1
                                        leaves no space between adjacent bars */

      defaultBand: '2_4',              /* The band that is pre-selected on
                                          first view load */

      defaultSliderExtent: [34, 66],   /* The initial extent of the 5Ghz slider,
                                        in channel units, on first view load. */

      disallowedChannelOpacity: 0.35,  /* Opacity applied to the labels of
                                        restricted channels */

      domain2_4: [-1, 15],             /* The extent of the X axis for the 2.4
                                        Ghz band, in channel units */

      domain5: [34, 167],              /* The extent of the X axis for the 2.4
                                        Ghz band, in channel units */

      labelColor: 'black',             /* Color of the numeric count labels
                                        above each bar */

      labelPadding: 10,                /* The number of pixels separating
                                        each bar from its label */

      range: [0, 15],                  /* The extent of the y axis, in channel
                                        units */

      heightFactor: 0.97               /* Height of the visualization as a
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
        gridLineOpacity: 0,
        height: undefined,
        labelX: globals.strings.accessPointCount.labelX,
        labelY: globals.strings.accessPointCount.labelY,
        navLeftDomain: prefs.domain2_4,
        navLeftLabel: globals.strings.accessPointCount.label2_4,
        navLeftPercent: 0.2,
        navMargins: {
          top: 10,
          bottom: 20,
          left: 50,
          right: 10
        },
        navPercent: 0.2,
        navRightDomain: prefs.domain5,
        navRightLabel: globals.strings.accessPointCount.label5,
        range: prefs.range,
        sliderExtent: undefined,
        width: undefined,
        xAxisTickInterval: 1,
        yAxisTickInterval: 3,
        elemUpdateFn: elemUpdateCallback,
        elemScrollFn: elemScrollCallback,
        axisScrollFn: axisScrollCallback,
        bandChangeFn: bandChangeCallback,
        saveStateFn: saveStateCallback
      };

      /* Choose canvas dimensions that will fit the container */
      config.width = $('#current-view').width();
      config.height = $('#current-view').height() * prefs.heightFactor;

      /* If this is first view load, configure vis with default slider location
        and band selection.  Othersiwe, configure with the state that was
        saved on last view unload. */
      config.band = accessPointCountState.band() || prefs.defaultBand;
      config.sliderExtent = accessPointCountState.sliderExtent() || prefs.defaultSliderExtent;

      /* Build the visualization with the our configuration and custom
         callbacks */
      var vis = visBuilder.newVisualization('#vis');

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
       VisBuilder.  It adds, updates, and removes the bars and their labels.
       Refer to comments in VisBuilder for details. */
    function elemUpdateCallback(dep) {
      accessPoints.getAll().then(function(results) {

        /* Will map each channel to its number of access points */
        var numOccupants = {};

        /* Will contain an array of data objects of the form:
         { channel: <number>, occupancy: <number> }.  To be
         used by d3 as the dataset */
        var data = [];

        var ap; // tmp

        /* Determine the access point counts */
        for (var i = 0; i < results.length; ++i) {
          ap = results[i];

          if (numOccupants[ap.channel] === undefined) {
            numOccupants[ap.channel] = 1;

          } else {
            numOccupants[ap.channel] += 1;
          }
        }

        /* Build dataset */
        for (var channel in numOccupants) {
          data.push({
            channel: channel,
            occupancy: numOccupants[channel]
          });
        }

        /* If necessary, change the Y scale to prevent bars from going off
           the screen */
        rescaleVertically(data);

        /* Update bar and label height with new dataset */
        updateBars(data);
        updateLabels(data);
      });

      /* Update bar heights across the entire visualization.

         @param data - an array of data objects of the form:
          { channel: <number>, occupancy: <number> }
      */
      function updateBars(data) {
        /* Update the bars in each section of the visualization (the main
        window and both nav panes) */
        updateSection(dep.mainScaleX, dep.mainScaleY, dep.mainCanvas, data);
        updateSection(dep.navLeftScaleX, dep.navScaleY, dep.navLeftCanvas, data);
        updateSection(dep.navRightScaleX, dep.navScaleY, dep.navRightCanvas, data);

        /* A general function for updating the bars in a particular section
           of the visualization.  Just pass in the appropriate scales
           and canvases.

           @param xScale - d3 scale object for section's X scale
           @param yScale - d3 scale object for section's Y scale
           @param canvas - the target svg canvas
           @param data - an array of data objects of the form:
                   { channel: <number>, occupancy: <number> }
        */
        function updateSection(xScale, yScale, canvas, data) {
          /* Bind dataset to existing (or not yet existing) bar elements,
             using channel as a "key". */
          var bars = canvas.selectAll('.bar')
            .data(data, function(d) {
              return d.channel;
            });

          /* Stop any in-progress transitions */
          bars.interrupt();

          /* Create a bar for each new data point */
          bars.enter().append('rect')
            .classed('bar', true)
            .attr('width', barWidth(xScale))
            // Start with 0 height so appearance can be animated
            .attr('height', 0)
            .attr('x', function(d) {
              return xScale(d.channel);
            })
            .attr('transform', function(d) {
              // Center the new bars on their channel label
              return 'translate(-' + (barWidth(xScale) / 2) + ')';
            })
            .attr('y', yScale(0))
            .attr('fill', prefs.barFillColor)
            .attr('stroke-width', prefs.barStrokeWidth)
            .attr('stroke', prefs.barStrokeColor);

          /* Transition each bar to its new height */
          bars
            .transition()
            .duration(transitionInterval)
              .attr('y', function(d) {
                return yScale(d.occupancy);
              })
              .attr('height', function(d) {
                return yScale(0) - yScale(d.occupancy);
              });

          /* Transition out any bars that no longer map to a data point */
          bars.exit()
            .transition()
            .duration(transitionInterval)
              .attr('y', yScale(0))
              .remove();
        };
      };

      /* Update label positions in the main view.

        @param data - an array of data objects of the form:
          { channel: <number>, occupancy: <number> }
      */
      function updateLabels(data) {
        /* Bind dataset to label elements */
        var labels = dep.mainCanvas.selectAll('text')
          .data(data, function(d) {
            return d.channel;
          });

        /* Stop any in-progress transitions */
        labels.interrupt();

        /* Create a label for each new data point */
        labels.enter().append('text')
          .text(function(d) {
            return d.occupancy;
          })
          .attr('fill', prefs.labelColor)
          .attr('x', function(d) {
            return dep.mainScaleX(d.channel);
          })
          .attr('transform', function(d) {
            // Center label over bar
            return 'translate(-' + (this.getBBox().width / 2) + ')';
          })
          .attr('y', dep.mainScaleY(0))

        /* Move each label to its new position */
        labels
          .transition()
          .duration(transitionInterval)
            .attr('y', function(d) {
              return dep.mainScaleY(d.occupancy) - prefs.labelPadding;
            })
            .text(function(d) {
              return d.occupancy;
            });

        /* Remove any labels that don't map to a data point */
        labels.exit()
        .transition()
        .duration(transitionInterval)
          .attr('y', dep.mainScaleY(globals.constants.signalFloor))
          .remove();
      };

      /* Rescale the Y axis to bring bars which have left frame back into view.

        @param data - an array of data objects of the form:
         { channel: <number>, occupancy: <number> }
      */
      function rescaleVertically(data) {
        /* Get the highest access point count in the new datset */
        var maxOccupancy = d3.max(data, function(d) {
          return d.occupancy;
        });

        /* Vertically rescale each portion of the visualization accordingly */
        rescaleSection(dep.mainContainer, dep.mainAxisFnY,
                       dep.mainCanvas, dep.mainScaleY);
        rescaleSection(null, null, dep.navLeftCanvas, dep.navScaleY);
        rescaleSection(null, null, dep.navRightCanvas, dep.navScaleY);

        /* Rescale a particular section of the visualization */
        function rescaleSection(container, axisFn, canvas, yScale) {
          var rescaleNeeded = false;

          /* Do we need a rescale? */
          if (maxOccupancy >= yScale.domain()[1]) {
            yScale.domain([0, maxOccupancy * 1.125]);
            rescaleNeeded = true;
          } else if (maxOccupancy < prefs.range[1] * 0.875) {
            yScale.domain(prefs.range);
            rescaleNeeded = true;
          }

          if (rescaleNeeded) {
            /* Make sure we don't try to rescale non-existent axes */
            if (container && axisFn) {
              container.select('.y.axis').call(axisFn);
            }

            /* Apply the new Y scale to each bar */
            canvas.selectAll('.bar')
              .interrupt()
              .attr('height', function(d) {
                return yScale(0) - yScale(d.occupancy);
              })
              .attr('y', function(d) {
                return yScale(d.occupancy);
              });

            /* Apply new Y scale to each label */
            canvas.selectAll('text')
              .interrupt()
              .attr('y', function(d) {
                return yScale(d.occupancy) - prefs.labelPadding;
              });
          }
        };

      };

    };

    /* @param xScale - The d3 scale object representing the X scale

       @returns - The appropriate bar width, in pixels, for the given scale
    */
    function barWidth(xScale) {
      return (xScale(1) - xScale(0)) * prefs.barWidth;
    };

    /* Move plot elements to match a new 5Ghz slider extent.
       Called whenever the slider is moved.  Refer to comments in VisBuilder for
       details
    */
    function elemScrollCallback(dep) {
      /* Move bars */
      dep.mainCanvas.selectAll('.bar')
        .attr('x', function(d) {
          return dep.mainScaleX(d.channel);
        });

      /* Move labels */
      dep.mainCanvas.selectAll('text')
        .attr('x', function(d) {
          return dep.mainScaleX(d.channel);
        });
    };

    /* Rescale x axis to account for a new 5 Ghz slider extent. Called whenever
       slider is moved. Refer to comments in VisBuilder for details */
    function axisScrollCallback(dep) {

      /* If we just switched to the 2.4 Ghz band, rescale appropriately */
      if (dep.band === '2_4') {
        dep.mainScaleX.domain(prefs.domain2_4);
      }
      /* Otherwise, rescale to the slider extent */
      else if (dep.band === '5') {
        dep.mainScaleX
          .domain([dep.navRightScaleX.invert(dep.slider.attr('x')),
            dep.navRightScaleX.invert(parseFloat(dep.slider.attr('x')) +
            parseFloat(dep.slider.attr('width')))]);
      }

      /* Update the axis */
      dep.mainContainer.select('.x.axis').call(dep.mainAxisFnX);

      markRestrictedChannels(dep);
    };

    /* Invoked whenever the user selects a different band.  Refer to comments
       in VisBuilder for details. */
    function bandChangeCallback(dep) {

      /* Update the X axis to reflect the new band */
      axisScrollCallback(dep);

      /* Move elements to their new position */
      elemScrollCallback(dep);

      /* Correct the width of each bar */
      dep.mainCanvas.selectAll('.bar')
        .attr('width', function(d) {
          return barWidth(dep.mainScaleX);
        })
        .attr('transform', function(d) {
          return 'translate(-' + (barWidth(dep.mainScaleX) / 2) + ')';
        });

      /* Correnct the text alignment */
      dep.mainCanvas.selectAll('text')
        .attr('transform', function(d) {
          return 'translate(-' + (this.getBBox().width / 2) + ')';
        });

      /* Make sure the X axis has enough ticks for all the channels */
      dep.mainAxisFnX.ticks(dep.mainScaleX.domain()[1] - dep.mainScaleX.domain()[0]);
      dep.mainContainer.select('.x.axis').call(dep.mainAxisFnX);

      markRestrictedChannels(dep);
    };

    /* Grey out any channel labels that represent a restricted channel.
       Remove any labels that don't correspond to a real channel  (since making
       a custom axis would be kinda hard)

       @param dep.mainContainer - svg canvas for main section
    */
    function markRestrictedChannels(dep) {
      /* Remove all channel labels that aren't actually channels */
      dep.mainContainer.selectAll('.x.axis > .tick')
        .filter(function(d) {
          return channelValidator.isAllowableChannel(d) === undefined;
        })
          .remove();

      /* Grey out restricted channels */
      dep.mainContainer.selectAll('.x.axis > .tick')
        .filter(function(d) {
          return channelValidator.isAllowableChannel(d) === false;
        })
          .style('opacity', prefs.disallowedChannelOpacity)
    };

    /* Invoked whenever saveState() is called on the visualization object
       returned by VisBuilder.  Refer to VisBuidler comments for details */
    function saveStateCallback(dep) {
      var extentMin, extentMax;

      /* Get the current slider extent */
      extentMin = dep.navRightScaleX.invert(parseFloat(dep.slider.attr('x'))),
      extentMax = dep.navRightScaleX.invert(parseFloat(dep.slider.attr('x')) +
                                  parseFloat(dep.slider.attr('width')));

      /* Save our current state */
      accessPointCountState.band(dep.band);
      accessPointCountState.sliderExtent([extentMin, extentMax]);
    };

    init();

  });

}]);
