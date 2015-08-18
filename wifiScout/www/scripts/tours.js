"use strict";

if (typeof setup === 'undefined') { setup = {} }

setup.tours = function() {
  tours = {};

  tours.channelTable = {
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
        content: strings.channelTable.tour.intro
      },
      {
        target: '#nav-left',
        content: strings.channelTable.tour.band2_4
      },
      {
        target: "#nav-right",
        content: strings.channelTable.tour.band5
      }]
  };

  tours.APTable = {
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
        content: strings.APTable.tour.intro
      },
      {
        target: "#level-header",
        content: strings.APTable.tour.level
      },
      {
        target: "#header",
        content: strings.APTable.tour.sorting
      },
      {
        target: "#channel-header",
        content: strings.APTable.tour.channel
      },
      {
        target: "#capabilities-header",
        content: strings.APTable.tour.capabilities
      },
      {
        target: "#filter-button",
        content: strings.APTable.tour.filter
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
        content: strings.timeGraph.tour.graph,
      },
      {
        target: "#legend",
        content: strings.timeGraph.tour.list
      },
      {
        target: "#filter-button",
        content: strings.timeGraph.tour.filter
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
        content: strings.signalStrength.tour.intro
      },
      {
        target: ".min-level",
        content: strings.signalStrength.tour.minLevel
      },
      {
        target: ".max-level",
        content: strings.signalStrength.tour.maxLevel
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
      content: strings.channelGraph.tour.intro
      },
      {
        target: '#nav-left',
        content: strings.channelGraph.tour.band2_4
      },
      {
        target: "#nav-right",
        content: strings.channelGraph.tour.band5
      },
      {
        target: '#filter-button',
        content: strings.channelGraph.tour.filter
      }
    ]
  };

};
