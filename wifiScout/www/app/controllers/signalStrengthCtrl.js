app.controller('signalStrengthCtrl', ['$scope', '$timeout', 'APService',
  'signalStrengthSettingsService', 'levelTransformService',
  'cordovaService', function($scope, $timeout, APService,
  signalStrengthSettingsService, levelTransformService, cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        $scope.allAPData = [];
        $scope.level = undefined;
        $scope.minLevel = undefined;
        $scope.maxLevel = undefined;
        var gauge;

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
          updateLevels();
        };

        var selectedBSSID = "",
            isDuplicateSSID = {},
            gauge = undefined,
            UPDATE_INTERVAL = 500;

        var updateDuplicateSSIDs = function() {
          var found = {},
              newDuplicates = {};
          for (var i = 0; i < $scope.allAPData.length; ++i) {
            if (found[$scope.allAPData[i].SSID]) {
              newDuplicates[$scope.allAPData[i].SSID] = true;
            } else {
              found[$scope.allAPData[i].SSID] = true;
            }
          }
          $scope.isDuplicateSSID = newDuplicates;
        };

        var updateList = function() {
          $scope.allAPData = APService.getNamedAPData();
        };

        var update = function() {
          $scope.$apply(function() {
            updateList();
            updateLevels();
            updateDuplicateSSIDs();
          });
          setTimeout(update, UPDATE_INTERVAL)
        };

        // Color scale -  Green = 4-5 bars
        //                Yellow = 2-3 bars
        //                Red = 1-2 bars
        var initGauge = function() {
          gauge = AmCharts.makeChart( "chartdiv", {
          "type": "gauge",
          "theme": "none",
          "startDuration": 0.5,
          "axes": [ {
          "axisThickness": 1,
            "axisAlpha": 0.2,
            "tickAlpha": 0.2  ,
            "valueInterval": -10,
            "bands": [ {
              "color": "#84b761",
              "endValue": -77,
              "startValue": 0
            }, {
              "color": "#fdd400",
              "endValue": -86,
              "startValue": -77
            }, {
               "color": "#fdd400",
               "endValue": -92,
               "startValue": -86
            }, {
               "color": "#cc4748",
               "endValue": -101,
               "startValue": -92
            }, {
               "color": "#cc4748",
               "endValue": -120,
               "startValue": -101
            } ],
               //"bottomText": "0 dBm",
               //"bottomTextYOffset": -20,
               //"bottomTextFontSize": 20,
               "endValue": -120
            }, ],
                "arrows": [{

                }],
                "export": {
                  "enabled": true
                }
            });

          setInterval(1, 10000);
        };

        var updateLevels = function() {
          var selectedAP = APService.getSingleAPData(selectedBSSID);
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

        var init = function() {
          initGauge();
          setTimeout(update, UPDATE_INTERVAL);
        }

        /* INIT */

        init();
      },
      function rejected() {
        console.log("signalStrengthCtrl is unavailable because Cordova is not loaded.");
      }
    )
  }]);
