"use strict";

var defaults = {
  visScaleMax: -30,
  detectHidden: false,
  language: 'en',
  region: 'US',
  startingView: 'channelGraph',
  backgroundColor: '#f1f1f1',
  themeColor: '#62bf01'
};

var constants = {
  signalFloor: -100,
  signalCeil: -10,
  moderateThresh: 15,
  highThresh: 30,
  updateIntervalFast: 500,
  updateIntervalNormal: 1000,
  updateIntervalSlow: 2000,
  updateIntervalVerySlow: 3000,
  minFreq2_4Ghz: 2412,
  maxFreq2_4Ghz: 2484,
  minFreq5Ghz: 5170,
  maxFreq5Ghz: 5825,
  region: undefined
};

var events = {
  setupDone: 'setupdone',
  newLegendData: 'newlegenddata',
  newSelection: 'newselection',
  newTimeGraphData: 'newtimegraphdata',
  transitionDone: 'transitionDone'
};

var globals = {
  language: undefined,
  strings: undefined,
  region: undefined
};
