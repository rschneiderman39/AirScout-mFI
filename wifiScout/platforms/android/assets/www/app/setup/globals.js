"use strict";

setupModule.service('globals', function() {

  this.defaults = {
    visScaleMax: -30,
    detectHidden: false,
    language: 'en',
    region: 'US',
    startingView: 'channelGraph',
    backgroundColor: '#f1f1f1',
    themeColor: '#62bf01',
    padding: 10
  };

  this.constants = {
    signalFloor: -100,
    signalCeil: -10,
    minFreq2_4Ghz: 2412,
    maxFreq2_4Ghz: 2484,
    minFreq5Ghz: 5170,
    maxFreq5Ghz: 5825,
  };

  this.updateIntervals = {
    channelGraph: 2000,
    accessPointCount: 2000,
    timeGraph: 1000,
    accessPointTable: 2000,
    signalStrength: 1000
  };

  this.events = {
    newLegendData: 'newlegenddata',
    newSelection: 'newselection',
    newTimeGraphData: 'newtimegraphdata',
    orientationChanged: 'orientationchanged',
    transitionDone: 'transitiondone'
  };

  this.language = undefined;

  this.strings = undefined;

  this.region = undefined;

  this.tours = {};

  this.debug = false;

});
