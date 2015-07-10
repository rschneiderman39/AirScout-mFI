app.controller('timeGraphCtrl', ['$scope', '$timeout', 'APService', 'APSelectorService',
	'timeGraphDataService', 'cordovaService', function($scope, $timeout, APService,
	APSelectorService, timeGraphDataService, cordovaService) {
		cordovaService.ready.then (
			function resolved() {
				$scope.labels = [];
  			$scope.SSIDs;
  			$scope.levels;
				$scope.colors;
				$scope.chart;
				$scope.options = {
					animation: false,
					scaleOverride: true,
					scaleStartValue: -100,
					scaleStepWidth: 5,
					scaleSteps: 14,
					datasetFill: false,
					pointDot: false
				};

				var _UPDATE_INTERVAL = 2000;

        var _updateNow = function() {
          $scope.SSIDs = timeGraphDataService.getOrderedSSIDs();
					$scope.levels = timeGraphDataService.getOrderedLevels();
					$scope.colors = timeGraphDataService.getOrderedColors();
        };

				var _update = function() {
					_updateNow();
					$timeout(_update, _UPDATE_INTERVAL);
				};

				for (var i = 30; i >= 0; i -= 2) {
					$scope.labels.push(i.toString());
				};

				_update();
			},
      function rejected() {
        console.log("timeGraphCtrl is unavailable because Cordova is not loaded.");
      }
		)
	}
]);
