document.channelTableTour = {
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
    previousText: {{strings.tours.previousText}},
    nextText: {{strings.tours.nextText}},
    finishText: {{strings.tours.finishText}},
    animationDuration: 400, // Animation Duration for the box and mask
    dark: false // Dark mode (Works great with `mask.visible = false`)
  },
  steps: [{
      content: {{strings.tours.channelTable.step1}},
    },
    {
      target: '#navLeft',
      content: {{strings.tours.channelTable.step2}},
    },
    {
      target: "#navRight",
      content: {{strings.tours.channelTable.step3}},
    }
  ]
};

document.apTableTour = {
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
    previousText: {{strings.tours.previousText}},
    nextText: {{strings.tours.nextText}},
    finishText: {{strings.tours.finishText}},
    animationDuration: 400,
    dark: false
  },
  steps: [{
      target: '#step1',
      content: {{strings.tours.apTable.step1}},
    },
    {
      target: "#step2",
      content: {{strings.tours.apTable.step2}},
    },
    {
      target: "#step3",
      content: {{strings.tours.apTable.step3}},
    },
    {
      target: "#step4",
      content: {{strings.tours.apTable.step4}},
    }
  ]
};

document.timeGraphTour = {
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
    previousText: {{strings.tours.previousText}},
    nextText: {{strings.tours.nextText}},
    finishText: {{strings.tours.finishText}},
    animationDuration: 400,
    dark: false
  },
  steps: [{
      target: "#timeGraph",
      content: {{strings.tours.timeGraph.step1}},
    },
    {
      target: "#step4",
      content: {{strings.tours.timeGraph.step2}},
    }
  ]
};

document.signalStrengthTour = {
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
    previousText: {{strings.tours.previousText}},
    nextText: {{strings.tours.nextText}},
    finishText: {{strings.tours.finishText}},
    animationDuration: 400,
    dark: false
  },
  steps: [{
      content: {{strings.tours.signalStrength.step1}},
    },
    {
      target: ".minLevel",
      content: {{strings.tours.signalStrength.step2}},
    },
    {
      target: ".maxLevel",
      content: {{strings.tours.signalStrength.step3}},
    }
  ]
};

document.channelGraphTour = {
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
    previousText: {{strings.tours.previousText}},
    nextText: {{strings.tours.nextText}},
    finishText: {{strings.tours.finishText}},
    animationDuration: 400,
    dark: false
  },
  steps: [{
    content: {{strings.tours.channelGraph.step1}},
    },
    {
      target: '#navLeft',
      content: {{strings.tours.channelGraph.step2}},
    },
    {
      target: "#navRight",
      content: {{strings.tours.channelGraph.step3}},
  ]
};