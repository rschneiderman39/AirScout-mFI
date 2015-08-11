if (typeof utils === 'undefined') {
  utils = {};
}

utils.accessPointSubset = function(accessPoints, macAddrs) {
  var subset = [],
      include = {};

  for (var i = 0; i < macAddrs.length; ++i) {
    include[macAddrs[i]] = true;
  }

  for (var i = 0; i < accessPoints.length; ++i) {
    if (include[accessPoints[i].MAC]) {
      subset.push(accessPoints[i]);
    }
  }

  return subset;
};

utils.getManufacturer = function(macAddr) {
  return manufacturers[macAddr.slice(0, 8)] || "<unknown>";
};

utils.deepCopy = function(object) {
  return JSON.parse(JSON.stringify(object));
};

utils.destroy = function(obj) {
  for (var key in obj) {
    if (isNaN(parseInt(key))) destroy(obj[key]);
  }
  delete obj;
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
  return 'M' + (xScale(0) - xScale(2)) + ' ' + yScale(constants.noSignal) +
         'Q' + 0 + ' ' + yScale(constants.noSignal + 2 * (level - constants.noSignal)) +
         ' ' + (xScale(2) - xScale(0)) + ' ' + yScale(constants.noSignal);
};

utils.customSSIDSort = function(AP) {
  if (AP.SSID.charAt(0) === '<') {
    return "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz" + AP.BSSID;
  } else {
    return AP.SSID + AP.BSSID;
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
  return strings.viewTitles[view] !== undefined;
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
