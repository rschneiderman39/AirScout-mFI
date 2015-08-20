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
      animationDuration: 1000, // Animation Duration for the box and mask
      dark: false // Dark mode (Works great with `mask.visible = false`)
    },
    steps: [{
<<<<<<< Updated upstream
        content: globals.strings.channelTable.tour.intro
      },
      {
        target: '#nav-left',
        content: globals.strings.channelTable.tour.band2_4
      },
      {
        target: "#nav-right",
        content: globals.strings.channelTable.tour.band5
=======
        content: strings.accessPointCount.tour.intro
      },
      {
        target: '#nav-left',
        content: strings.accessPointCount.tour.band2_4
      },
      {
        target: "#nav-right",
        content: strings.accessPointCount.tour.band5
>>>>>>> Stashed changes
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
      animationDuration: 1000,
      dark: false
    },
    steps: [{
<<<<<<< Updated upstream
        content: globals.strings.APTable.tour.intro
      },
      {
        target: "#level-header",
        content: globals.strings.APTable.tour.level
      },
      {
        target: "#header",
        content: globals.strings.APTable.tour.sorting
      },
      {
        target: "#channel-header",
        content: globals.strings.APTable.tour.channel
      },
      {
        target: "#capabilities-header",
        content: globals.strings.APTable.tour.capabilities
      },
      {
        target: "#filter-button",
        content: globals.strings.APTable.tour.filter
=======
        content: strings.accessPointTable.tour.intro
      },
      {
        target: "#level-header",
        content: strings.accessPointTable.tour.level
      },
      {
        target: "#header",
        content: strings.accessPointTable.tour.sorting
      },
      {
        target: "#channel-header",
        content: strings.accessPointTable.tour.channel
      },
      {
        target: "#capabilities-header",
        content: strings.accessPointTable.tour.capabilities
      },
      {
        target: "#filter-button",
        content: strings.accessPointTable.tour.filter
>>>>>>> Stashed changes
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
      animationDuration: 1000,
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
      animationDuration: 1000,
      dark: false
    },
    steps: [{
        content: globals.strings.signalStrength.tour.intro
      },
      {
        target: ".min-level",
        content: globals.strings.signalStrength.tour.minLevel
      },
      {
        target: ".max-level",
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
      animationDuration: 1000,
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
