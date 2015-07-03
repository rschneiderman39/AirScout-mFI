app.factory('APSelectorService', function() {
  var service = {};

  // Returns an array containing the elements of "APs" whose BSSID is
  // listed in "BSSIDs". Don't modify the return value.
  service.filter = function(APData, BSSIDs) {
    var selectedAPData = [];
    if (BSSIDs.length > 0) {
      for (var i = 0; i < APData.length; ++i) {
        for (var j = 0; j < BSSIDs.length; ++j) {
          if (APData[i].BSSID === BSSIDs[j]) { selectedAPData.push(APData[i]); }
        }
      }
    }
    return selectedAPData;
  };

  // Returns the AP specified by the passed BSSID. Don't modify the return
  // value.
  service.select = function(APData, BSSID) {
    var selectedAPData = null;
    if (BSSID !== "") {
      for (var i = 0; i < APData.length; ++i) {
        if (APData[i].BSSID === BSSID) {
          selectedAPData = APData[i];
          break;
        }
      }
    }
    return selectedAPData;
  }

  return service;
});
