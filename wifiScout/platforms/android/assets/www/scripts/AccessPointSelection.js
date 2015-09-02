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
