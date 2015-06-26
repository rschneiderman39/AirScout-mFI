app.factory('filterService', function() {
  var service = {};

  // Filter an array of APs by BSSID
  service.filter = function(APs, BSSIDs) {
    var selectedAPs = [];
    if (BSSIDs !== null) {
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

  return service;
});
