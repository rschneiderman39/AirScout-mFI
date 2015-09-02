"use strict";

app.service('utils', ['globals', function(globals) {

  this.macToManufacturer = function(macAddr) {
    return manufacturers[macAddr.slice(0, 8)] || globals.strings.unknownManufacturer;
  };

  this.freqToChannel = function(freq) {
    if (this.inBand(freq, '2_4')) {
      return (freq - 2407) / 5;
    } else if (this.inBand(freq, '5')) {
      return (freq - 5000) / 5;
    }
  };

  this.getRandomColor = function() {
    var hue = (Math.floor(Math.random() * 360)).toString(10),
        sat = Math.floor(30 + (Math.random() * 70)),
        lum = Math.floor(30 + (Math.random() * 30));

    return 'hsla(' + hue + ', ' + sat + '%, ' + lum + '%, 1)';
  };

  this.generateTriangle = function(width, height) {
    return 'M' +(-width / 2)+ ' 0 L 0 -' +height+ 'L' +(width/2)+ ' 0 z';
  };

  this.generateParabola = function(level, xScale, yScale) {
    return 'M' + (xScale(0) - xScale(2)) + ' ' + yScale(globals.constants.signalFloor) +
           'Q' + 0 + ' ' + yScale(globals.constants.signalFloor + 2 * (level - globals.constants.signalFloor)) +
           ' ' + (xScale(2) - xScale(0)) + ' ' + yScale(globals.constants.signalFloor);
  };

  this.customSSIDSort = function(ap) {
    if (ap.ssid.charAt(0) === '<') {
      return "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz" + ap.mac;
    } else {
      return ap.ssid + ap.mac;
    }
  };

  this.inBand = function(freq, band) {
    if (band === '2_4') {
      return freq >= globals.constants.minFreq2_4Ghz &&
             freq <= globals.constants.maxFreq2_4Ghz;
    } else if (band === '5') {
      return freq >= globals.constants.minFreq5Ghz &&
             freq <= globals.constants.maxFreq5Ghz;
    }
  };

  this.toNewAlpha = function(color, alpha) {
    var attrs = color.split(',');
    attrs[3] = alpha.toString() + ')';
    return attrs.join(",");
  };

  this.toLighterShade = function(color, factor) {
    var attrs = color.replace(new RegExp('%', 'g'), "").replace('hsla(', "").replace(')', "").split(',');

    var hue = attrs[0],
        sat = attrs[1],
        lum = Math.floor(parseInt(attrs[2]) + (100 - parseInt(attrs[2])) * factor),
        alpha = attrs[3];

    return 'hsla(' + hue + ',' + sat + '%,' + lum + '%,' + alpha + ')';
  }

  this.spanLen = function(span) {
    return span[1] - span[0];
  };

  this.orderElements = function(parentSelector, elem1Selector, elem2Selector) {
    console.log('ordering elements');
    var parent = $(parentSelector)[0],
        elem1 = $(elem1Selector)[0],
        elem2 = $(elem2Selector)[0];

    parent.insertBefore(elem1, elem2);
  };

  this.getOrientation = function() {
    if ($(window).width() > $(window).height()) {
      return 'landscape';
    } else {
      return 'portrait';
    }
  };

}]);
