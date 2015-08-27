"use strict";

if (typeof setup === 'undefined') { var setup = {}; }

var tours = {};

setup.tours = function() {
  tours.accessPointCount = {
    config: {
      mask: {
        visible: true, // Shows the element mask
        clickThrough: false, // Allows the user to interact with elements beneath the mask
        clickExit: true, // Exit the tour when the user clicks on the mask
        scrollThrough: true, // Allows the user to scroll while hovered over the mask
        color: 'rgba(0,0,0,.7)' // The mask color
      },
      container: 'body', // The container to mask
      scrollBox: 'body', // The container to scroll when searching for elements
      previousText: 'Previous',
      nextText: 'Next',
      finishText: 'Finish',
      animationDuration: 0, // Animation Duration for the box and mask
      dark: false, // Dark mode (Works great with `mask.visible = false`)
      heightFactor: 0.5,
      widthFactor: 0.3
    },
    steps: [{
        content: globals.strings.accessPointCount.tour.intro
      },
      {
        target: '#nav-left',
        content: globals.strings.accessPointCount.tour.band2_4
      },
      {
        target: "#nav-right",
        content: globals.strings.accessPointCount.tour.band5
      }]
  };

  tours.accessPointTable = {
    config: {
      mask: {
        visible: true,
        clickThrough: false,
        clickExit: true,
        scrollThrough: true,
        color: 'rgba(0,0,0,.7)'
      },
      container: 'body',
      scrollBox: 'body',
      previousText: 'Previous',
      nextText: 'Next',
      finishText: 'Finish',
      animationDuration: 0,
      dark: false
    },
    steps: [{
        content: globals.strings.accessPointTable.tour.intro
      },
      {
        target: "#level-header",
        content: globals.strings.accessPointTable.tour.level
      },
      {
        target: "#header",
        content: globals.strings.accessPointTable.tour.sorting
      },
      {
        target: "#channel-header",
        content: globals.strings.accessPointTable.tour.channel
      },
      {
        target: "#capabilities-header",
        content: globals.strings.accessPointTable.tour.capabilities
      },
      {
        target: "#filter-button",
        content: globals.strings.accessPointTable.tour.filter
      }]
  };

  tours.timeGraph = {
    config: {
      mask: {
        visible: true,
        clickThrough: false,
        clickExit: true,
        scrollThrough: true,
        color: 'rgba(0,0,0,.7)'
      },
      container: 'body',
      scrollBox: 'body',
      previousText: 'Previous',
      nextText: 'Next',
      finishText: 'Finish',
      animationDuration: 0,
      dark: false
    },
    steps: [{
        target: "#time-graph",
        content: globals.strings.timeGraph.tour.graph,
      },
      {
        target: "#legend",
        content: globals.strings.timeGraph.tour.list
      },
      {
        target: "#filter-button",
        content: globals.strings.timeGraph.tour.filter
      }
    ]
  };

  tours.signalStrength = {
    config: {
      mask: {
        visible: true,
        clickThrough: false,
        clickExit: true,
        scrollThrough: true,
        color: 'rgba(0,0,0,.7)'
      },
      container: 'body',
      scrollBox: 'body',
      previousText: 'Previous',
      nextText: 'Next',
      finishText: 'Finish',
      animationDuration: 0,
      dark: false
    },
    steps: [{
        content: globals.strings.signalStrength.tour.intro
      },
      {
        target: "#min-level",
        content: globals.strings.signalStrength.tour.minLevel
      },
      {
        target: "#max-level",
        content: globals.strings.signalStrength.tour.maxLevel
      }
    ]
  };

  tours.channelGraph = {
    config: {
      mask: {
        visible: true,
        clickThrough: false,
        clickExit: true,
        scrollThrough: true,
        color: 'rgba(0,0,0,.7)'
      },
      container: 'body',
      scrollBox: 'body',
      previousText: 'Previous',
      nextText: 'Next',
      finishText: 'Finish',
      animationDuration: 0,
      dark: false
    },
    steps: [{
      content: globals.strings.channelGraph.tour.intro
      },
      {
        target: '#nav-left',
        content: globals.strings.channelGraph.tour.band2_4
      },
      {
        target: "#nav-right",
        content: globals.strings.channelGraph.tour.band5
      },
      {
        target: '#filter-button',
        content: globals.strings.channelGraph.tour.filter
      }
    ]
  };

};