app.controller('plotCtrl', ['$scope', '$timeout', 'APService', 'APSelectorService',
	'plotDataService', 'cordovaService', function($scope, $timeout, APService,
	APSelectorService, plotDataService, cordovaService) {
		cordovaService.ready.then (
			function resolved() {
				/*
				$scope.labels;
				$scope.initSSIDs;
				$scope.initLevels;
				$scope.initColors;
				$scope.options
				*/
  			var _labels,
				    _options,
				    _SSIDs,
  			    _levels,
				    _colors,
						_chart;

/*
				var _processPlotData = function(data) {
					$scope.$apply(function() {
						$scope.SSIDs = data.orderedSSIDs;
						$scope.levels = data.orderedLevels;
						$scope.colors = data.orderedColors;
					});
					plotDataService.getPlotData().done(_processPlotData);
				};
*/

				var _processPlotData = function(data) {
					_SSIDs = data.orderedSSIDs;
					_levels = data.orderedLevels;
					_colors = data.orderedColors;
					_updatePlot();
					plotDataService.getPlotData().done(_processPlotData);
				};

				var _updatePlot = function() {
					var oldDataLen = _chart.datasets.length,
					    newDataLen = _SSIDS.length;

					for (var i = 0 ; i < newDataLen; ++i) {
						if (i < oldDataLen) {
							_chart.datasets[i].label = _SSIDs[i];
							_chart.datasets[i].strokeColor = _colors[i];
							_chart.datasets[i].data = _levels[i];
						} else {
							_chart.datasets.push(
								{
									label: _SSIDs[i],
									fillColor: "rgba(0,0,0,0.5)",
									pointColor: "rgba(0,0,0,1)",
									pointStrokeColor: "#000",
									strokeColor: _colors[i],
									data: _levels[i]
								}
							);
						}
						if (i === newDataLen - 1 && i < oldDataLen - 1) {
							_chart.datasets.splice(i+1, oldDataLen - newDataLen);
						}
					}
					_chart.update();
				};


				_labels = plotDataService.getLabels();
				_options = plotDataService.getOptions();

				plotDataService.getInitPlotData().done(
					function(data) {
						_SSIDs = data.orderedSSIDs;
						_levels = data.orderedLevels;
						_colors = data.orderedColors;

						var ctx = $("#line").get(0).getContext("2d");
						_chart = new Chart(ctx).Line(
							{
								labels: _labels,
								datasets: [
									{
										label: "",
            				fillColor: "rgba(220,220,220,0.5)",
            				strokeColor: "rgba(220,220,220,1)",
            				pointColor: "rgba(220,220,220,1)",
            				pointStrokeColor: "#fff",
            				data: [-100]
	        				}
								]
							},
							_options
						);
						/*
						_updatePlot();
						plotDataService.getPlotData().done(_processPlotData);
						*/
					}
				);
			},
      function rejected() {
        console.log("plotCtrl is unavailable because Cordova is not loaded.");
      }
		)
	}
]);
