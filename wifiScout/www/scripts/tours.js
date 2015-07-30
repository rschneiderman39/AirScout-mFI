if (typeof app === 'undefined') {
  app = {};
}

if (typeof app.setup === 'undefined') {
  app.setup = {};
}

app.setup.tours = function() {
  app.tours = {};

  app.tours.channelTable = {
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
        content: app.strings.channelTable.tour.intro
      },
      {
        target: '#navLeft',
        content: app.strings.channelTable.tour.band2_4
      },
      {
        target: "#navRight",
        content: app.strings.channelTable.tour.band5,
      }
    ]
  };

  app.tours.APTable = {
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
        content: app.strings.APTable.tour.intro
      },
      {
        target: "#step2",
        content: app.strings.APTable.tour.channel
      },
      {
        target: "#step3",
        content: app.strings.APTable.tour.capabilities
      },
      {
        target: "#filter-button",
        content: app.strings.APTable.tour.filter
      }
    ]
  };

  app.tours.timeGraph = {
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
        content: app.strings.timeGraph.tour.intro,
      },
      {
        target: "#filter-button",
        content: app.strings.timeGraph.tour.filter
      }
    ]
  };

  app.tours.signalStrength = {
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
        content: app.strings.signalStrength.tour.intro
      },
      {
        target: ".minLevel",
        content: app.strings.signalStrength.tour.minLevel
      },
      {
        target: ".maxLevel",
        content: app.strings.signalStrength.tour.maxLevel
      }
    ]
  };

  app.tours.channelGraph = {
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
      content: app.strings.channelGraph.tour.intro
      },
      {
        target: '#navLeft',
        content: app.strings.channelGraph.tour.band2_4
      },
      {
        target: "#navRight",
        content: app.strings.channelGraph.tour.band5
      }
    ]
  };
};
