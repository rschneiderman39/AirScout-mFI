app.controller('plotCtrl', ['$scope', '$timeout', 'APService', 'APSelectorService',
	'plotDataService', 'cordovaService', function($scope, $timeout, APService,
	APSelectorService, plotDataService, cordovaService) {
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
          $scope.SSIDs = plotDataService.getOrderedSSIDs();
					$scope.levels = plotDataService.getOrderedLevels();
					$scope.colors = plotDataService.getOrderedColors();
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
        console.log("plotCtrl is unavailable because Cordova is not loaded.");
      }
		)
	}
]);
