"use strict";

setupModule.service('setupSequence', ['globals', function(globals) {

  var done = $.Deferred();
  this.done = done;

  $(document).on('deviceready', function() {
    setupLanguage().then(function() {
      setupRegion().then(function() {
        setupTours();
        done.resolve();
      });
    });
  });

  function setupLanguage() {
    var progress = $.Deferred();

    navigator.globalization.getPreferredLanguage(
      function success(lang) {
        var langCode = lang.value.split('-')[0];
        globals.strings = languages[langCode] || languages[globals.defaults.language];
        progress.resolve();

      }, function failure() {
        globals.strings = languages[globals.defaults.language];
        progress.resolve();
      });

    return progress;
  };

  function setupRegion() {
    var progress = $.Deferred();

    navigator.globalization.getLocaleName(
      function success(locale) {
        var regionCode = locale.value.split('-')[1];
        globals.region = channels[regionCode] ? regionCode : globals.defaults.region;
        progress.resolve();

      },
      function failure() {
        globals.region = globals.defaults.region;
        progress.resolve();
      }
    );

    return progress;
  };

  function setupTours() {
    globals.tours.accessPointCount = {
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
        widthFactor: 0.5
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

    globals.tours.accessPointTable = {
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
        dark: false,
        heightFactor: 0.5,
        widthFactor: 0.5
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
        animationDuration: 0,
        dark: false,
        heightFactor: 0.5,
        widthFactor: 0.5
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
        animationDuration: 0,
        dark: false,
        heightFactor: 0.5,
        widthFactor: 0.5
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
        animationDuration: 0,
        dark: false,
        heightFactor: 0.5,
        widthFactor: 0.5
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
        }
      ]
    };
  };

}]);
