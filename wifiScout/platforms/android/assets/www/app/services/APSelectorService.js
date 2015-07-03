app.factory('APSelectorService', function() {
  var service = {};

  // Returns an array containing the elements of "APs" whose BSSID is
  // listed in "BSSIDs". Don't modify the return value.
  service.filter = function(APData, BSSIDs) {
    var selectedAPData = [],
        BSSIDMap = {};
    for (var i = 0; i < BSSIDs.length; ++i) {
      BSSIDMap[BSSIDs[i]] = true;
    }
    if (BSSIDs.length > 0) {
      for (var i = 0; i < APData.length; ++i) {
        if (BSSIDMap[APData[i].BSSID] === true) {
          selectedAPData.push(APData[i]);
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
