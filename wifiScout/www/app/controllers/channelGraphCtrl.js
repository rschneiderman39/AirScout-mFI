app.controller('channelGraphCtrl', ['$scope', 'channelGraphDataService', 'APService', 'cordovaService',
  function($scope, channelGraphDataService, APService, cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        $scope.panLeft = function(px) {
          $('.parabolaLabel').remove();
          plot.pan({ left: px * -1 });
        };
        $scope.panRight = function(px) {
          $('.parabolaLabel').remove();
          plot.pan({ left: px });
        };

        var data = [[0,-100]];

        var options =
        {
          legend: {
            show: false
          },
          series: {
            curvedLines: {
              apply: true,
              active: true,
              monotonicFit: true
            }
          },
          xaxis: {
            min: 0,
            max: 14,
            tickSize: 1,
    				zoomRange: [1, 1],
    				panRange: [-100, 100]
    			},
    			yaxis: {
            min: -100,
            max: -30,
    				zoomRange: [1, 1],
    				panRange: [-100, -30]
    			},
    			zoom: {
    				interactive: false
    			},
    			pan: {
    				interactive: true
    			},
          touch: {
      	    pan: 'x',
      	    scale: "",
      	    autoWidth: false,
      	    autoHeight: false
      	  }
        };

        var plot = $("#parabolas").plot(data, options).data("plot"),
            UPDATE_INTERVAL = 1000;



        var update = function() {
          // Remove previous labels
          $('.parabolaLabel').remove();
          plot.setData(channelGraphDataService.generateDatasets());
          plot.draw();
          setTimeout(update, UPDATE_INTERVAL);
        }

        update();
      },
      function rejected() {
        console.log('channelGraphCtrl is unavailable because Cordova is not loaded.');
      }
    )
  }])
