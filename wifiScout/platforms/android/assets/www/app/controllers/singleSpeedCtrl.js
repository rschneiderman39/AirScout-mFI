app.controller('singleSpeedCtrl', ['$scope', '$timeout', 'APService', 'filterService',
                                   'singleSpeedSettingsService', 'cordovaService',
  function($scope, $timeout, APService, filterService, singleSpeedSettingsService, cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        $scope.allAPs = [];
        $scope.listBy = 'SSID';
        $scope.level = 0;
        $scope.minLevel = 0;
        $scope.maxLevel = 0;
        $scope.isSelected = function(MAC) {
          return MAC === _selectedBSSID;
        };
        $scope.setSelected = function(MAC) {
          _selectedBSSID = MAC;
        };

        var _selectedBSSID = null;

        var _gauge = undefined;

        var _forceUpdate = function () {
          $scope.allAPs = APService.getNamedAPs();
          var selectedAP = filterService.select($scope.allAPs, _selectedBSSID);
          if (selectedAP !== null) {
            $scope.level = selectedAP.level;
            if ($scope.level < $scope.minLevel) {
              $scope.minLevel = $scope.level;
            }
            if ($scope.level > $scope.maxLevel) {
              $scope.maxLevel = $scope.level;
            }
            console.log('setting guage');
            _gauge.set(Math.abs($scope.level) * 30);
          }
        };

        var _update = function () {
          _forceUpdate();
          $timeout(_update, 500)
        };

        (function initGauge() {
          var opts = {
    			  lines: 12,
    			  angle: 0.1,
    			  lineWidth: 0.3,
    			  pointer: {
    			    length: 0.9,
    			    strokeWidth: 0.035,
    			    color: '#000000'
    			  },
    			  limitMax: 'false',
    			  percentColors: [[0.0, "#FF0000" ], [0.1, "#FF3300"],
                            [0.20, "#ff6600" ],  [0.30, "#ff9900"],
                            [0.40, "#FFCC00"], [0.50, "#FFFF00"],
                            [0.60, "#ccff00"], [0.70, "#99ff00"],
                            [0.80, "#66ff00"], [0.90, "#00FF00"],
                            [1.0, "#00FF00"]],
    			  strokeColor: '#E0E0E0',
    			  generateGradient: true
    			};
          var target = document.getElementById('foo');
    			_gauge = new Gauge(target).setOptions(opts);
    			_gauge.maxValue = 3000;
    			_gauge.animationSpeed = 120;
          _gauge.set(0);
        })();

        _update();

      },
      function rejected() {
        console.log("singelSpeedCtrl is unavailable because Cordova is not loaded.");
      }
    )
  }]);
