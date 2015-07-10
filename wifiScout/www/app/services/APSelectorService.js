/* Provides some utility functions for generating subsets from arrays
   of AP data */
app.factory('APSelectorService', function() {
  var service = {};

  /* Select a subset from an array of AP data.
     @param APData - An array of AP data objects, as returned by APService
     @param BSSIDs - The array of the BSSIDs which will be used to generate the subset
     @returns - An array containing every AP data object in APData whose BSSID matches
                one contained in BSSIDs
  */
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

  /* Select a single AP data object from an array of AP data.
     @param APData - An array of AP data objects, as returned by APService
     @param BSSID - The hardware address of the AP whose data object we want to select
     @returns - The AP data object corresponding to the BSSID specified
  */
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
