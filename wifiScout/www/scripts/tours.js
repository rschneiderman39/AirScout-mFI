if (typeof globals === 'undefined') {
  globals = {};
}

if (typeof globals.setup === 'undefined') {
  globals.setup = {};
}

globals.setup.tours = function() {
  globals.tours = {};

  globals.tours.channelTable = {
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
      animationDuration: 400, // Animation Duration for the box and mask
      dark: false // Dark mode (Works great with `mask.visible = false`)
    },
    steps: [{
        content: globals.strings.channelTable.tour.intro
      },
      {
        target: '#navLeft',
        content: globals.strings.channelTable.tour.band2_4
      },
      {
        target: "#navRight",
        content: globals.strings.channelTable.tour.band5
      }
    ]
  };

  globals.tours.APTable = {
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
      animationDuration: 400,
      dark: false
    },
    steps: [{
        target: '#step1',
        content: globals.strings.APTable.tour.intro
      },
      {
        target: "#step2",
        content: globals.strings.APTable.tour.channel
      },
      {
        target: "#step3",
        content: globals.strings.APTable.tour.capabilities
      },
      {
        target: "#filter-button",
        content: globals.strings.APTable.tour.filter
      }
    ]
  };

  globals.tours.timeGraph = {
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
      animationDuration: 400,
      dark: false
    },
    steps: [{
        target: "#timeGraph",
        content: globals.strings.timeGraph.tour.intro,
      },
      {
        target: "#filter-button",
        content: globals.strings.timeGraph.tour.filter
      }
    ]
  };

  globals.tours.signalStrength = {
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
      animationDuration: 400,
      dark: false
    },
    steps: [{
        content: globals.strings.signalStrength.tour.intro
      },
      {
        target: ".minLevel",
        content: globals.strings.signalStrength.tour.minLevel
      },
      {
        target: ".maxLevel",
        content: globals.strings.signalStrength.tour.maxLevel
      }
    ]
  };

  globals.tours.channelGraph = {
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
      animationDuration: 400,
      dark: false
    },
    steps: [{
      content: globals.strings.channelGraph.tour.intro
      },
      {
        target: '#navLeft',
        content: globals.strings.channelGraph.tour.band2_4
      },
      {
        target: "#navRight",
        content: globals.strings.channelGraph.tour.band5
      }
    ]
  };
};