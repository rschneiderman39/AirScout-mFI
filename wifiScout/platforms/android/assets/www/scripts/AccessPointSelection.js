/* Represents an access point selection.  Can be used to
   filter an array of AccessPoint objects.

   @constructor(macAddrs, showAll):
     @param macAddrs: Array of MAC addresses that specifies the set of
       selected access points.
     @param showAll: Set to true for a selection that is guaranteed to be all-
       inclusive, false otherwise.

   @method apply(accessPoint): apply this selection to an array of AccessPoint
     objects, returning an array containing only the selected ones.

   @method contains(mac): Returns true if the selection contains the given
     MAC address, false otherwise.

   Usage:
   - for an all-inclusive selection: new AccessPointSelection(<doesn't matter>, true)
   - for an empty selection: new AccessPointSelection([], false)
   - for an arbitrary selection: new AccessPointSelection(["11:22:33:44:55:66",...], false)
*/
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
