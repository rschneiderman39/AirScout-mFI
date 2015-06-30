app.factory('filterService', function() {
  var service = {};

  // Returns an array containing the elements of "APs" whose BSSID is
  // listed in "BSSIDs". Don't modify the return value.
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

  // Returns the AP specified by the passed BSSID. Don't modify the return
  // value.
  service.select = function(APs, BSSID) {
    var selectedAP = null;
    if (BSSID !== null) {
      for (var i = 0; i < APs.length; ++i) {
        if (APs[i].BSSID === BSSID) {
          selectedAP = APs[i];
          break;
        }
      }
    }
    return selectedAP;
  }

  return service;
});
