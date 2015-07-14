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
            gauge.set(levelTransformService.gaugeTransform($scope.level));
          }
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

        var initGauge = function() {
          var opts = {
    			  lines: 12,
    			  angle: 0.1,
    			  lineWidth: 0.3,
    			  pointer: {
    			    length: 0.75,
    			    strokeWidth: 0.035,
    			    color: '#000000'
    			  },
    			  limitMax: 'false',
    			  percentColors: [[0.0, "#FF0000" ], [0.1, "#FF0000"],
                            [0.20, "#FF3300" ],  [0.30, "#ff6600"],
                            [0.40, "#FF9900"], [0.50, "#FFcc00"],
                            [0.60, "#ffff00"], [0.70, "#ccff00"],
                            [0.80, "#99ff00"], [0.90, "#66FF00"],
                            [1.0, "#00FF00"]],
    			  strokeColor: '#E0E0E0',
    			  generateGradient: true
    			};
          var target = document.getElementById('foo');
    			gauge = new Gauge(target).setOptions(opts);
    			gauge.maxValue = 700;
    			gauge.animationSpeed = 120;
          gauge.set(1);
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
