"use strict";

/* Handles user interaction with the filtering options modal */
app.controller('filterModalCtrl', ['$scope', '$state', '$filter', 'globals',
'utils', 'accessPoints', 'globalSettings', 'setupSequence', function($scope, $state,
$filter, globals, utils, accessPoints, globalSettings, setupSequence) {

  setupSequence.done.then(function() {

    /* Feed this bad boy a macAddr and it returns true if the
       corresponding access point is selected. */
    var macAddrIsSelected = {};

    $scope.strings = globals.strings;

    /* Array of AccessPoint objects to be displayed on the list */
    $scope.accessPoints = [];

    /* This custom sort function makes hidden access
    points appear at the bottom of the list instead of the top */
    $scope.sortSSID = utils.customSSIDSort;

    /* If an access point already selected, unselect it.  Otherwise,
       select it.

       @param ap - AccessPoint object
    */
    $scope.toggleSelected = function(ap) {
      if (! macAddrIsSelected[ap.mac]) {
        macAddrIsSelected[ap.mac] = true;
      } else {
        macAddrIsSelected[ap.mac] = false;
      }

      updateSelection();
    };

    /* Determines if an access point is selected on the modal list

      @param ap - AccessPoint object

      @returns - true: if the access point is selected. false or
       undefined:  if the access point is not selected
    */
    $scope.isSelected = function(ap) {
      return macAddrIsSelected[ap.mac];
    };

    /* Select all access points on the list. Actually disables
     access point filtering entirely, and simply displays any access
     points that come into range
    */
    $scope.selectAll = function() {
      $.each($scope.accessPoints, function(i, ap) {
        macAddrIsSelected[ap.mac] = true;
      });
                                               // show all ap's
      apSelection(new AccessPointSelection([], true));
    };

    /* Deselect all access points on the list.
    */
    $scope.unselectAll = function() {
      $.each($scope.accessPoints, function(i, ap) {
        macAddrIsSelected[ap.mac] = false;
      });
                      // Empty selection
      apSelection(new AccessPointSelection([], false));
    };

    function init() {
      /* Setup event handler for modal show */
      $('#filter-modal').on('show.bs.modal', onShow);

      orient();

      $(window).on('resize', orient);

      function orient() {
        console.log('reorienting');

        if (utils.getOrientation() === 'portrait') {
          console.log('in portrait');
          $('#right-column .list').css('height', $(window).height() * 0.6);
        } else if (utils.getOrientation() === 'landscape') {
          console.log('in landscape');
          $('#right-column .list').css('height', $(window).height() * 0.65);
        }
      }
    };

    /* When the modal displays, take a snapshot of the current access point
       data and use that to populate the list.  To prevent list items
       from moving around, no additional access point data is fetched after
       this point. */
    function onShow() {
      // Find matches
      // mql = window.matchMedia("(orientation: portrait)");

      // If there are matches, we're in portrait
      //if(mql.matches) {
        // Portrait orientation
      //  $('#modal-list').css('height', $(window).height() * 0.6);
    //  }
    //  else {
        // Landscape orientation
      //  $('#modal-list').css('height', $(window).height() * 0.65);
    //  }

      // Add a media query change listener
  //    mql.addListener(function(m) {
      //  if(m.matches) {
          // Changed to portrait
      //    $('#right-column .list').css('height', $(window).height() * 0.6);
    //    }
    //    else {
          // Changed to landscape
      //    $('#right-column .list').css('height', $(window).height() * 0.65);
      //  }
    //  });

      $scope.stopTour();

      accessPoints.getAll().then(function(results) {
        $scope.$apply(function() {
          var selectedAccessPoints;

          $scope.accessPoints = results;

          /* Get the current access point selection and */
          selectedAccessPoints = apSelection().apply(results);

          $.each(selectedAccessPoints, function(i, ap) {
            macAddrIsSelected[ap.mac] = true;
          });
        });
      });
    };

    /* Convenient wrapper for the current access point selection.
       As with globalSettings.accessPointSelection, it behaves
       as a hybrid getter/setter
    */
    function apSelection(newSelection) {
      if (newSelection === undefined) {
        return globalSettings.accessPointSelection();
      }

      globalSettings.accessPointSelection(newSelection);
    };

    /* Update the global access point selection to reflect
       the elements currently selected on the list */
    function updateSelection() {
      var selectedMacs = [];

      $.each(macAddrIsSelected, function(mac, selected) {
        if (selected) selectedMacs.push(mac);
      });

      apSelection(new AccessPointSelection(selectedMacs, false));
    };

    init();
  });

}]);
