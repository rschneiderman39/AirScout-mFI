"use strict";

app.controller('plotCtrl', ['$scope', '$timeout', 'APService', 'APSelectorService',
	'plotDataService', 'cordovaService', function($scope, $timeout, APService,
	APSelectorService, plotDataService, cordovaService) {
		cordovaService.ready.then (
			function resolved() {

  			var _ctx,
						_plot,
						_update = true,
						_performanceMultiplier = 1;

				var _updatePlot = function(data) {
					if (_update) {
						var before = (new Date()).getTime(),
						    renderTime;
						plotDataService.requestPlotData().done(_updatePlot);
						_plot = new Chart(_ctx).Line(
							{
								labels: plotDataService.getLabels(),
								datasets: data
							},
							plotDataService.getOptions()
						);
						renderTime = (new Date()).getTime() - before;
						console.log(renderTime);
						if (renderTime >= plotDataService.getInterval()) {
							console.log('performance');
							_performanceMultiplier *= 2;
							plotDataService.enablePerformanceMode();
						} else if (_performanceMultiplier > 1 &&
											 renderTime < plotDataService.getInterval() * .2) {
						  console.log('normal');
							_performanceMultiplier /= 2;
							plotDataService.enableNormalMode();
						}
					}
				};

				$scope.$on('$destroy', function() {
					_update = false;
				});

				plotDataService.requestInitPlotData().done(
					function(data) {
						_ctx = $("#line").get(0).getContext("2d");
						_plot = new Chart(_ctx).Line(
							{
								labels: plotDataService.getLabels(),
								datasets: data
							},
							plotDataService.getOptions()
						);
						plotDataService.requestPlotData().done(_updatePlot);
					}
				);
			},
      function rejected() {
        console.log("plotCtrl is unavailable because Cordova is not loaded.");
      }
		)
	}
]);
