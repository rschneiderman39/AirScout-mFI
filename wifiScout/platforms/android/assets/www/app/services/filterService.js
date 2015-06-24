app.factory('filterService', function() {
  var service = {};

  // Returns the sublist of <APs> whose BSSIDs are listed in <BSSIDs>.
  service.filterByBSSID = function(APs, BSSIDs) {
    var selectedAPs = [];
    if (SSIDs !== null) {
      for (var i = 0; i < APs.length; ++i) {
        for (var j = 0; j < BSSIDs.length; ++j) {
          if (APs[i].BSSID === BSSIDs[j]) { selectedAPs.push(APs[i]); }
        }
      }
    } else {
      selectedAPs = APs;
    }
    return selectedAPs;
  };

  // Returns the sublist of <APs> whose SSIDs are listed in <SSIDs>.
  service.filterBySSID = function(APs, SSIDs) {
    var selectedAPs = [];
    if (SSIDs !== null) {
      for (var i = 0; i < APs.length; ++i) {
        for (var j = 0; j < SSIDs.length; ++j) {
          if (APs[i].SSID === SSIDs[j]) { selectedAPs.push(APs[i]); }
        }
      }
    } else {
      selectedAPs = APs;
    }
    return selectedAPs;
  };

  return service;
});
