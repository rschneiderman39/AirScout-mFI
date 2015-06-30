app.controller('singleSpeedCtrl', ['$scope', '$timeout', 'APService', 'filterService',
                                   'singleSpeedSettingsService', 'cordovaService',
  function($scope, $timeout, APService, filterService, singleSpeedSettingsService, cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        $scope.singleSpeed = {
          allAPs: [],
          listBy: 'SSID',
          level: 0,
          minLevel: 0,
          maxLevel: 0,
          isSelected: function(MAC) {
            return MAC === _selectedBSSID;
          },
          setSelected: function(MAC) {
            _selectedBSSID = MAC;
          }
        };

        var _selectedBSSID = null;

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
          }
        };

        var _update = function () {
          _forceUpdate();
          $timeout(_update, 100)
        };

        _update();

      },
      function rejected() {
        console.log("singelSpeedCtrl is unavailable because Cordova is not loaded.");
      }
    )
  }]);
