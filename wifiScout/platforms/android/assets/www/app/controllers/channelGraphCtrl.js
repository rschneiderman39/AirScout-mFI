app.controller('channelGraphCtrl', ['channelGraphDataService', 'APService', 'cordovaService',
  function(channelGraphDataService, APService, cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        var data = [
                     { label: "Foo",
                       data: [ [0, -100], [1, -50], [2, -100] ]
                     },
                     { label: "Foo",
                       data: [ [8, -100], [9, -80], [10, -100] ]
                     }
                    ];

        var options =
        {
          series: {
            curvedLines: {
              apply: true,
              active: true,
              monotonicFit: true
            }
          }
        };

        var plot = $("#parabolas").plot(data, options).data("plot");

        var update = function() {
          data = [];
          for (var i = 1; i < 6; ++i) {
            data.push(
              {
                label: i.toString(),
                data: [[i-1, -100], [i, Math.random()*70 - 100], [i+1, -100]]
              }
            );
          }
          plot.setData(data);
          plot.setupGrid();
          plot.draw();
          setTimeout(update, 2000);
        }

        update();
      },
      function rejected() {
        console.log('channelGraphCtrl is unavailable because Cordova is not loaded.');
      }
    )
  }])
