app.controller('singleSpeedCtrl', ['$scope', '$timeout', 'APService',
  'APSelectorService', 'singleSpeedSettingsService', 'levelTransformService',
  'cordovaService', function($scope, $timeout, APService, APSelectorService,
  singleSpeedSettingsService, levelTransformService, cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        $scope.allAPData = [];
        $scope.selector = 'SSID';
        $scope.selectedSSID;
        $scope.level;
        $scope.minLevel;
        $scope.maxLevel;
        $scope.isSelected = function(ap) {
          if (typeof ap.BSSID !== 'undefined') {
            return ap.BSSID === _selectedBSSID;
          }
        };
        $scope.setSelected = function(ap) {
          if (typeof ap.BSSID !== 'undefined') {
            _selectedBSSID = ap.BSSID;
            $scope.selectedSSID = ap.SSID;
          }
        };

        var _selectedBSSID = "";

        var _gauge = undefined;

        var _forceUpdate = function () {
          $scope.allAPData = APService.getNamedAPData();
          var selectedAP = APSelectorService.select($scope.allAPData, _selectedBSSID);
          if (selectedAP !== null) {
            $scope.level = selectedAP.level;
            $scope.minLevel = APService.getMinLevel(selectedAP.BSSID);
            $scope.maxLevel = APService.getMaxLevel(selectedAP.BSSID);
            _gauge.set(levelTransformService.gaugeTransform($scope.level));
          }
        };

        var _update = function () {
          _forceUpdate();
          $timeout(_update, 500)
        };

        var _pushSettings = function() {
          singleSpeedSettingsService.setSelectedBSSID(_selectedBSSID);
          singleSpeedSettingsService.setSelectedSSID($scope.selectedSSID);
        };

        var _pullSettings = function() {
          _selectedBSSID = singleSpeedSettingsService.getSelectedBSSID();
          $scope.selectedSSID = singleSpeedSettingsService.getSelectedSSID();
        };

        (function initGauge() {
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
    			_gauge = new Gauge(target).setOptions(opts);
    			_gauge.maxValue = 600;
    			_gauge.animationSpeed = 120;
          _gauge.set(1);
        })();

        _pullSettings();

        $scope.$on('$destroy', _pushSettings);

        _update();

      },
      function rejected() {
        console.log("singleSpeedCtrl is unavailable because Cordova is not loaded.");
      }
    )
  }]);
