app.controller('signalStrengthCtrl', ['$scope', 'accessPoints',
'setupService', function($scope, accessPoints, setupService) {

  var prefs = {
    updateInterval: 1000
  };
  
  setupService.ready.then(function() {
    $scope.strings = globals.strings;

    $scope.APData = [];
    $scope.isDuplicateSSID = {};
    $scope.level = undefined;
    $scope.minLevel = undefined;
    $scope.maxLevel = undefined;

    $scope.isSelected = function(ap) {
      if (typeof ap.BSSID !== 'undefined') {
        return ap.BSSID === selectedBSSID;
      }
    };

    $scope.setSelected = function(ap) {
      if (typeof ap.BSSID !== 'undefined') {
        selectedBSSID = ap.BSSID;
      }
      $scope.level = undefined;
      $scope.minLevel = undefined;
      $scope.maxLevel = undefined;
    };

    $scope.sortSSID = globals.utils.customSSIDSort;

    var selectedBSSID = "",
        gauge = undefined;

    var updateDuplicateSSIDs = function() {
      var found = {},
          newDuplicates = {};
      for (var i = 0; i < $scope.APData.length; ++i) {
        if (found[$scope.APData[i].SSID]) {
          newDuplicates[$scope.APData[i].SSID] = true;
        } else {
          found[$scope.APData[i].SSID] = true;
        }
      }
      $scope.isDuplicateSSID = newDuplicates;
    };

    var updateLevels = function() {
      var selectedAP = accessPoints.get(selectedBSSID);
      if (selectedAP !== null) {
        $scope.level = selectedAP.level;
        if ($scope.minLevel === undefined) {
          $scope.minLevel = $scope.level;
        } else if ($scope.level < $scope.minLevel) {
          $scope.minLevel = $scope.level;
        }
        if ($scope.maxLevel === undefined) {
          $scope.maxLevel = $scope.level;
        } else if ($scope.level > $scope.maxLevel) {
          $scope.maxLevel = $scope.level;
        }
        gauge.arrows[ 0 ].setValue( $scope.level );
      }
    };

    var updateList = function() {
      $scope.APData = accessPoints.getAll();
    };

    var update = function() {
      $scope.$apply(function() {
        updateList();
        updateLevels();
        updateDuplicateSSIDs();
      });
    };

    // Color scale -  Green = 4-5 bars
    //                Yellow = 2-3 bars
    //                Red = 1-2 bars
    var initGauge = function() {
      gauge = AmCharts.makeChart( "chartdiv", {
      "type": "gauge",
      "theme": "none",
      "startDuration": 0.9,
      "startEffect": "easeOutSine",
      "axes": [ {
      "axisThickness": 1,
        "axisAlpha": 0.2,
        "tickAlpha": 0.2,
        "valueInterval": 10,
        "bands": [ {
           "color": "#d3d3d3",
           "endValue": -95,
           "startValue": -100
        }, {
           "color": "#cc4748",
           "endValue": -85,
           "startValue": -95
        }, {
           "color": "#fdd400",
           "endValue": -60,
           "startValue": -85
        }, {
           "color": "#84b761",
           "endValue": -30,
           "startValue": -60
        } ],
           //"bottomText": "0 dBm",
           //"bottomTextYOffset": -20,
           //"bottomTextFontSize": 20,
           "startValue": -100,
           "endValue": -30
        } ],
            "arrows": [{

            }],
            "export": {
              "enabled": true
            }
        });
    };

    var prepView = function() {
      $('#chartdiv').css('height', globals.format.window.height * 0.70);
    };

    var init = function() {
      prepView();
      initGauge();

      var updateLoop = setInterval(update, prefs.updateInterval);

      $scope.$on('$destroy', function() {
        clearInterval(updateLoop);
      });
    };

    init();
  });

}]);
