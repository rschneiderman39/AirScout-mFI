"use strict";

var utils = {};

utils.macToManufacturer = function(macAddr) {
  return manufacturers[macAddr.slice(0, 8)] || globals.strings.unknownManufacturer;
};

utils.freqToChannel = function(freq) {
  if (utils.inBand(freq, '2_4')) {
    return (freq - 2407) / 5;
  } else if (utils.inBand(freq, '5')) {
    return (freq - 5000) / 5;
  }
};

utils.getRandomColor = function() {
  var hue = (Math.floor(Math.random() * 360)).toString(10),
      sat = Math.floor(30 + (Math.random() * 70)),
      lum = Math.floor(30 + (Math.random() * 30));

  return 'hsla(' + hue + ', ' + sat + '%, ' + lum + '%, 1)';
};

utils.generateTriangle = function(width, height) {
  return 'M' +(-width / 2)+ ' 0 L 0 -' +height+ 'L' +(width/2)+ ' 0 z';
};

utils.generateParabola = function(level, xScale, yScale) {
  return 'M' + (xScale(0) - xScale(2)) + ' ' + yScale(constants.signalFloor) +
         'Q' + 0 + ' ' + yScale(constants.signalFloor + 2 * (level - constants.signalFloor)) +
         ' ' + (xScale(2) - xScale(0)) + ' ' + yScale(constants.signalFloor);
};

utils.customSSIDSort = function(ap) {
  if (ap.ssid.charAt(0) === '<') {
    return "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz" + ap.mac;
  } else {
    return ap.ssid + ap.mac;
  }
};

utils.inBand = function(freq, band) {
  if (band === '2_4') {
    return freq >= constants.minFreq2_4Ghz &&
           freq <= constants.maxFreq2_4Ghz;
  } else if (band === '5') {
    return freq >= constants.minFreq5Ghz &&
           freq <= constants.maxFreq5Ghz;
  }
};

utils.isView = function(view) {
  return globals.strings.viewTitles[view] !== undefined;
};

utils.toNewAlpha = function(color, alpha) {
  var attrs = color.split(',');
  attrs[3] = alpha.toString() + ')';
  return attrs.join(",");
};

utils.toLighterShade = function(color, factor) {
  var attrs = color.replace(new RegExp('%', 'g'), "").replace('hsla(', "").replace(')', "").split(',');

  var hue = attrs[0],
      sat = attrs[1],
      lum = Math.floor(parseInt(attrs[2]) + (100 - parseInt(attrs[2])) * factor),
      alpha = attrs[3];

  return 'hsla(' + hue + ',' + sat + '%,' + lum + '%,' + alpha + ')';
}

utils.spanLen = function(span) {
  return span[1] - span[0];
};

function AccessPointSelection(macAddrs, showAll) {

  var isSelected = {};

  $.each(macAddrs, function(i, mac) {
    isSelected[mac] = true;
  });

  this.apply = function(accessPoints) {
    var selectedAccessPoints = [];

    if (showAll) {
      return accessPoints;
    }

    $.each(accessPoints, function(i, ap) {
      if (isSelected[ap.mac]) {
        selectedAccessPoints.push(ap);
      }
    });

    return selectedAccessPoints;
  };

  this.contains = function(mac) {
    if (showAll) {
      return true;
    }

    return isSelected[mac];
  };

  return this;
};
