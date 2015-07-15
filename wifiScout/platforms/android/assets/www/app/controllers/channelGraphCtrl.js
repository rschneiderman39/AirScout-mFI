app.controller('channelGraphCtrl', ['channelGraphDataService', 'cordovaService',
  function(channelGraphDataService, cordovaService) {
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
              monotonicFit: false,
              tension: 1
            }
          }
        };

        var plot = $("#parabolas").plot(data, options).data("plot");
      },
      function rejected() {
        console.log('channelGraphCtrl is unavailable because Cordova is not loaded.');
      }
    )
  }])
