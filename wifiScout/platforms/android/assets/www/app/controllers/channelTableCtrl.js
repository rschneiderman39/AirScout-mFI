<<<<<<< HEAD
app.controller('channelTableCtrl', ['$scope', 'channelTableDataService',
  'utilService', 'cordovaService', function($scope, channelTableDataService,
  utilService, cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        var band = "2_4Ghz",
            xDomain2_4Ghz = [-1, 15],
            xInitWindow5Ghz = [34, 66],
            xDomain5Ghz = [34, 167],
            yDomain = [-100, -30],
            FILL_ALPHA = 0.2,
            LABEL_PADDING = 10,
            UPDATE_INTERVAL = 2000,
            TRANSITION_INTERVAL = 1000;

        var spanLen = utilService.spanLen,
            isChannel = utilService.isChannel,
            setAlpha = utilService.setAlpha;

        var plotContainer, plotClip, navContainer, navClip, staticContainer,
            staticClip, navViewport, sliderLen;

        var dim = {
                    plot: {
                      containerWidth: 800,
                      containerHeight: 300,
                      width: undefined,
                      height: undefined,
                      margin: {
                        top: 20,
                        bottom: 20,
                        left: 40,
                        right: 20,
                      }
                    },
                    menu: {
                      containerWidth: 800,
                      containerHeight: 100,
                      staticPercent: 0.15,
                      width: undefined,
                      height: undefined,
                      static: {
                        width: undefined
                      },
                      nav: {
                        width: undefined
                      },
                      margin: {
                        top: 10,
                        bottom: 10,
                        left: 40,
                        right: 10,
                      }
                    }
                  };

        var scales = {
                      plot: {
                        x: undefined,
                        y: undefined
                      },
                      menu: {
                        y: undefined,
                        static: {
                          x: undefined,
                        },
                        nav: {
                          x: undefined,
                        }
                      }
                     };

        var axis = {
                    plot: {
                      x: undefined,
                      y: undefined
                    },
                    menu: {
                      y: undefined,
                      static: {
                        x: undefined,
                      },
                      nav: {
                        x: undefined,
                      }
                    }
                   };



        var init = function() {
          addPlot();
          addMenu();
        };

        var update = function() {
          var data = channelTableDataService.generateData();

          updateParabs('plot', data);
          updateParabs('static', data);
          updateParabs('nav', data);

          updateLabels(data);

          setTimeout(update, UPDATE_INTERVAL);
        };

        var updateAxisScale = function() {
          if (band === '2_4Ghz') {
            scales.plot.x.domain(xDomain2_4Ghz);
          } else if (band === '5Ghz') {
            scales.plot.x.domain(navViewport.extent());
          }

          plotContainer.select('.x.axis').call(axis.plot.x);

          removeNonChannelTicks();

/*
          plotClip.selectAll('ellipse')
            .remove();

          plotClip.selectAll('text')
            .remove();
            */
        };

        var addPlot = function() {
          dim.plot.width = dim.plot.containerWidth - dim.plot.margin.left - dim.plot.margin.right;
          dim.plot.height = dim.plot.containerHeight - dim.plot.margin.top - dim.plot.margin.bottom;

          plotContainer = d3.select('#plot').classed('chart', true).append('svg')
            .attr('width', dim.plot.containerWidth)
            .attr('height', dim.plot.containerHeight)
            .append('g')
              .attr('transform', 'translate(' + dim.plot.margin.left + ',' + dim.plot.margin.top + ')');

          plotClip = plotContainer.append('g')
            .attr('clip-path', 'url(#plotClip)');

          plotClip.append('clipPath')
            .attr('id', 'plotClip')
            .append('rect')
              .attr({ width: dim.plot.width, height: dim.plot.height });

          addPlotAxes();
        };

        var addPlotAxes = function() {
          var xDomain, xTicks;
          if (band === '2_4Ghz') {
            xDomain = xDomain2_4Ghz;
          } else if (band === '5Ghz') {
            xDomain = xInitWindow5Ghz;
          } else {
            return;
          }

          xTicks = utilService.spanLen(xDomain);

          scales.plot.x = d3.scale.linear()
            .domain(xDomain)
            .range([0, dim.plot.width]);

          scales.plot.y = d3.scale.linear()
            .domain(yDomain)
            .range([dim.plot.height, 0]);

          axis.plot.x = d3.svg.axis()
            .scale(scales.plot.x)
            .orient('bottom')
            .ticks(xTicks)
            .tickSize(1);

          axis.plot.y = d3.svg.axis()
            .scale(scales.plot.y)
            .orient('left')
            .ticks(8)
            .tickSize(1);

          plotContainer.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + dim.plot.height + ')')
            .call(axis.plot.x);

          plotContainer.append('g')
            .attr('class', 'y axis')
            .call(axis.plot.y);

          removeNonChannelTicks();
        };

        var addMenu = function() {
          dim.menu.width = dim.plot.width;
          dim.menu.height = dim.menu.containerHeight - dim.plot.margin.top - dim.plot.margin.bottom;

          scales.menu.y = d3.scale.linear()
            .domain(yDomain)
            .range([dim.menu.height, 0]);

          menuContainer = d3.select('#plot').classed('chart', true).append('svg')
            .attr('width', dim.menu.containerWidth)
            .attr('height', dim.menu.containerHeight)
            .append('g')
              .attr('transform', 'translate(' + dim.menu.margin.left + ',' + dim.menu.margin.top + ')');

          addStatic();
          addNav();
        };


        var addNav = function() {
          dim.menu.nav.width = dim.menu.width * (1 - dim.menu.staticPercent);

          navContainer = menuContainer.append('g')
            .classed('navigator', true)
            .attr('transform', 'translate(' + dim.menu.static.width + ', 0)');

          navClip = navContainer.append('g')
            .attr('clip-path', 'url(#navClip)');

          navClip.append('clipPath')
            .attr('id', 'navClip')
            .append('rect')
              .attr({ width: dim.menu.nav.width, height: dim.menu.height });

          addNavAxis();
          addViewport();
        };

        var addNavAxis = function() {
          scales.menu.nav.x = d3.scale.linear()
            .domain(xDomain5Ghz)
            .range([0, dim.menu.nav.width]);

          axis.menu.nav.x = d3.svg.axis()
            .scale(scales.menu.nav.x)
            .orient('bottom')
            .tickSize(1)
            .ticks(0);

          navContainer.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0, ' + dim.menu.height + ')')
            .call(axis.menu.nav.x);
        };

        var addViewport = function() {
          navViewport = d3.svg.brush()
            .x(scales.menu.nav.x)
            .on("brushstart", function() {
              setBand('5Ghz');
              scrollPlot();
            })
            .on("brush", scrollPlot)
            .on("brushend", scrollPlot);

          navContainer.append("g")
            .attr("class", "viewport")
            .call(navViewport)
              .selectAll("rect")
              .attr("height", dim.menu.height);

          initViewport();
        };

        var initViewport = function() {
          navViewport.extent(xInitWindow5Ghz);
          sliderLen = navViewport.extent()[1] - navViewport.extent()[0];
          navContainer.select('.viewport').call(navViewport);

          navClip.append('rect')
            .attr('id', 'navRect')
            .attr('width', navContainer.select('.viewport > .extent').attr('width'))
            .attr('height', dim.menu.height);
        };

        var addStatic = function() {
          dim.menu.static.width = dim.menu.width * dim.menu.staticPercent;

          staticContainer = menuContainer.append('g')
            .on('click', function() {
              setBand('2_4Ghz');
              updateAxisScale;
            });

          staticClip = staticContainer.append('g')
            .attr('clip-path', 'url(#staticClip)');

          staticClip.append('clipPath')
            .attr('id', 'staticClip')
            .append('rect')
              .attr({ width: dim.menu.static.width, height: dim.menu.height });

          staticClip.append('rect')
            .attr('id', 'staticRect')
            .attr('width', dim.menu.static.width)
            .attr('height', dim.menu.height)
            .attr('onclick', 'alert("clicked")');

          addStaticAxis();
        };

        var addStaticAxis = function() {
          scales.menu.static.x = d3.scale.linear()
            .domain(xDomain2_4Ghz)
            .range([0, dim.menu.static.width]);

          axis.menu.static.x = d3.svg.axis()
            .scale(scales.menu.static.x)
            .orient('bottom')
            .tickSize(1)
            .ticks(0);

          staticContainer.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0, ' + dim.menu.height + ')')
            .call(axis.menu.static.x);
        };

        var setBand = function(newBand) {
          if (newBand !== band) {
            if (newBand ===  '2_4Ghz') {
              navClip.select('#navRect').classed('active', false);
              staticClip.select('#staticRect').classed('active', true);
            } else if (newBand === '5Ghz') {
              staticClip.select('#staticRect').classed('active', false);
              navClip.select('#navRect').classed('active', true);
            }
            band = newBand;
            updateAxisScale();
          }
        }

        var scrollPlot = function() {
          /* Prevent slider from expanding */
          var extentMin = navViewport.extent()[0];
          if(utilService.spanLen(navViewport.extent()) !== sliderLen) {
            navViewport.extent([extentMin, extentMin + sliderLen]);
          }

          /* Move our custom navigator window */
          navClip.select('#navRect')
            .attr('x', scales.menu.nav.x(navViewport.extent()[0]));

          /* Update x axis */
          scales.plot.x.domain(navViewport.extent());
          plotContainer.select('.x.axis').call(axis.plot.x);
          removeNonChannelTicks();

          /* Move parabolas */
          plotClip.selectAll('ellipse')
            .attr('cx', function(d) {
              return scales.plot.x(d.channel);
            });

          /* Move labels */
          plotClip.selectAll('text')
            .attr('x', function(d) {
              return scales.plot.x(d.channel) - this.getBBox().width / 2;
            })
        };

        var removeNonChannelTicks = function() {
          plotContainer.selectAll('.x.axis > .tick')
            .filter(function (d) {return ! isChannel(d.toString());})
              .remove();
        }



        var updateLabels = function(data) {
          var labels = plotClip.selectAll('text')
            .data(data, function(d) {
              return d.BSSID;
            });

          labels.enter().append('text')
            .text(function(d) {
              return d.SSID;
            })
            .attr('fill', function(d) {
              return d.color;
            })
            .attr('x', function(d) {
              return scales.plot.x(d.channel) - this.getBBox().width / 2;
            })
            .attr('y', scales.plot.y(-100))
            .transition()
            .duration(TRANSITION_INTERVAL)
              .attr('y', function(d) {
                return scales.plot.y(d.level) - LABEL_PADDING;
              });

          labels
            .transition()
            .duration(TRANSITION_INTERVAL)
              .attr('y', function(d) {
                return scales.plot.y(d.level) - LABEL_PADDING;
              });

          labels.exit()
          .transition()
          .duration(TRANSITION_INTERVAL)
            .attr('y', scales.plot.y(-100))
            .remove();
        };

        var updateParabs = function(view, data) {
          var xScale, yScale, clip;
          if (view === 'plot') {
            xScale = scales.plot.x;
            yScale = scales.plot.y;
            clip = plotClip;
          } else if (view === 'static') {
            xScale = scales.menu.static.x;
            yScale = scales.menu.y;
            clip = staticClip;
          } else if (view === 'nav') {
            xScale = scales.menu.nav.x;
            yScale = scales.menu.y;
            clip = navClip;
          } else {
            return;
          }

          var parabs = clip.selectAll('ellipse')
            .data(data, function(d) {
              return d.BSSID;
            });

          /* Add new parabolas */
          parabs.enter().append('ellipse')
            .attr('cx', function(d) {
              return xScale(d.channel);
            })
            .attr('cy', yScale(-100))
            .attr('rx', function(d) {
              return (xScale(d.channel) - xScale(d.channel - 1)) * 2;
            })
            .attr('ry', 0)
            .attr('stroke', function(d) {
              return d.color;
            })
            .attr('fill', function(d) {
              return setAlpha(d.color, FILL_ALPHA);
            })
            .attr('stroke-width', '2')
              .transition()
              .duration(TRANSITION_INTERVAL)
                .attr('ry', function(d) {
                  return yScale(-100) - yScale(d.level);
                });

          /* Update existing parabolas */
          parabs
            .transition()
            .duration(TRANSITION_INTERVAL)
              .attr('ry', function(d) {
                return yScale(-100) - yScale(d.level);
              });

          /* Remove parabolas that are no longer bound to data */
          parabs.exit()
            .transition()
            .duration(TRANSITION_INTERVAL)
              .attr('ry', 0)
              .remove();
        };

        var clear = function() {
          d3.select('#plot').selectAll('*')
            .remove();
        };

        init();

        update();
      },
      function rejected() {
        console.log('channelTableCtrl is unavailable because Cordova is not loaded.');
      }
    )
}]);
=======
app.controller('channelTableCtrl', ['$scope', '$location', 'cordovaService', function($scope, $location,
  cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        console.log("IN CHANNELTABLE CTRL!");
        $scope.$on('animIn', function() {
                console.log('CHANNELTABLECTRL: animIn');
            });

        $scope.$on('animOut', function() {
          console.log('CHANNELTABLECTRL: animOut');
        });
      },
      function rejected() {
        console.log("channelTableCtrl is unavailable because Cordova is not loaded.");
      }
    )
  }
]);
>>>>>>> b5ec917f4f833ca10ce1b0c2c2b0e269bb3147d5
