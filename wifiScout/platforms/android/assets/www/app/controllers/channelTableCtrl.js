app.controller('channelTableCtrl', ['$scope', 'channelTableDataService', 'cordovaService',
  function($scope, channelTableDataService, cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        var plotContainer, plot, nav, viewport, sliderLen;

        var dim = {
                    plot: {
                      containerWidth: 800,
                      containerHeight: 400,
                      margin: {
                        top: 20,
                        bottom: 20,
                        left: 40,
                        right: 20,
                      }
                    },
                    nav: {
                      containerWidth: 800,
                      containerHeight: 100,
                      margin: {
                        top: 10,
                        bottom: 10,
                        left: 40,
                        right: 10,
                      }
                    }
                  };

        var scales = {
                      plot: {},
                      nav: {}
                     };

        var axes = {
                    plot: {},
                    nav: {}
                   };

        var band = "5Ghz",
            xDomain2_4Ghz = [0, 15],
            xWindow5Ghz = [36, 51],
            xDomain5Ghz = [35, 166],
            yDomain = [-100, -30],
            UPDATE_INTERVAL = 2000,
            TRANSITION_INTERVAL = 1000;

        var init = function() {
          addPlot();
          addPlotAxes(band);

          if (band === '5Ghz') {
            addNav();
            addNavAxes();
            addViewport();
            initViewport();
          }
        };

        var addPlot = function() {
          dim.plot.width = dim.plot.containerWidth - dim.plot.margin.left - dim.plot.margin.right;
          dim.plot.height = dim.plot.containerHeight - dim.plot.margin.top - dim.plot.margin.bottom;

          plotContainer = d3.select('#plot').classed('chart', true).append('svg')
            .attr('width', dim.plot.containerWidth)
            .attr('height', dim.plot.containerHeight)
            .append('g')
              .attr('transform', 'translate(' + dim.plot.margin.left + ',' + dim.plot.margin.top + ')');

          plot = plotContainer.append('g')
            .attr('clip-path', 'url(#plotClip)');

          plot.append('clipPath')
            .attr('id', 'plotClip')
            .append('rect')
              .attr({ width: dim.plot.width, height: dim.plot.height });
        };

        var addPlotAxes = function(band) {
          var xDomain, xTicks;
          if (band === '2_4Ghz') {
            xDomain = xDomain2_4Ghz;
          } else if (band === '5Ghz') {
            xDomain = xWindow5Ghz;
          } else {
            return;
          }

          xTicks = xDomain[1] - xDomain[0];

          scales.plot.x = d3.scale.linear()
            .domain(xDomain)
            .range([0, dim.plot.width]);

          scales.plot.y = d3.scale.linear()
            .domain(yDomain)
            .range([dim.plot.height, 0]);

          axes.plot.x = d3.svg.axis()
            .scale(scales.plot.x)
            .orient('bottom')
            .ticks(xTicks)
            .tickSize(1);

          axes.plot.y = d3.svg.axis()
            .scale(scales.plot.y)
            .orient('left')
            .ticks(8)
            .tickSize(1);

          plotContainer.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + dim.plot.height + ')')
            .call(axes.plot.x);

          plotContainer.append('g')
            .attr('class', 'y axis')
            .call(axes.plot.y);
        };

        var removePlotAxes = function() {
          plotContainer.selectAll('axis').remove();
        };

        var addNav = function() {
          dim.nav.width = dim.plot.width;
          dim.nav.height = 100 - dim.plot.margin.top - dim.plot.margin.bottom;

          navContainer = d3.select('#plot').classed('chart', true).append('svg')
            .classed('navigator', true)
            .attr('width', dim.nav.containerWidth)
            .attr('height', dim.nav.containerHeight)
            .append('g')
              .attr('transform', 'translate(' + dim.nav.margin.left + ',' + dim.nav.margin.top + ')');

          nav = navContainer.append('g')
            .attr('clip-path', 'url(#navClip)');

          nav.append('clipPath')
            .attr('id', 'navClip')
            .append('rect')
              .attr({ width: dim.nav.width, height: dim.nav.height });
        };

        var addNavAxes = function() {
          scales.nav.x = d3.scale.linear()
            .domain(xDomain5Ghz)
            .range([0, dim.nav.width]);

          scales.nav.y = d3.scale.linear()
            .domain(yDomain)
            .range([dim.nav.height, 0]);

          axes.nav.x = d3.svg.axis()
            .scale(scales.nav.x)
            .orient('bottom')
            .tickSize(1)
            .ticks(0);

          navContainer.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + dim.nav.height + ')')
            .call(axes.nav.x)
        };

        var addViewport = function() {
          viewport = d3.svg.brush()
            .x(scales.nav.x)
            .on("brush", scrollPlot);

          navContainer.append("g")
            .attr("class", "viewport")
            .call(viewport)
            .selectAll("rect")
            .attr("height", dim.nav.height);
        };

        var scrollPlot = function() {
          /* Prevent slider from expanding */
          var extentMin = viewport.extent()[0],
              extentMax = viewport.extent()[1];
          if(extentMax - extentMin !== extentLen) {
            viewport.extent([extentMin, extentMin + extentLen]);
          }

          scales.plot.x.domain(viewport.empty() ? scales.plot.x.domain()
                                                : viewport.extent());

          plotContainer.select('.x.axis').call(axes.plot.x);

          plot.selectAll('ellipse')
            .attr('cx', function(d) {
              return scales.plot.x(d.channel);
            });
        };

        var initViewport = function() {
          viewport.extent(scales.plot.x.domain());
          extentLen = viewport.extent()[1] - viewport.extent()[0];
          navContainer.select('.viewport').call(viewport);
        };

        var updateParabs = function(view, data) {
          var xScale, yScale, section;
          if (view === 'plot') {
            xScale = scales.plot.x;
            yScale = scales.plot.y;
            section = plot;
          } else if (view === 'nav') {
            xScale = scales.nav.x;
            yScale = scales.nav.y;
            section = nav;
          } else {
            return;
          }

          var parabs = section.selectAll('ellipse')
            .data(data, function(d) {
              return d.BSSID;
            });

          /* Add new parabolas */
          parabs.enter().append('ellipse')
            .attr('cx', function(d, i) {
              return xScale(d.channel);
            })
            .attr('cy', yScale(-100))
            .attr('rx', function(d, i) {
              return (xScale(d.channel) - xScale(d.channel - 1)) * 2;
            })
            .attr('ry', 0)
            .attr('stroke', function(d, i) {
              return d.color;
            })
            .attr('fill', 'transparent')
            .attr('stroke-width', '2')
              .transition()
              .duration(TRANSITION_INTERVAL)
                .attr('ry', function(d, i) {
                  return yScale(-100) - yScale(d.level);
                });

          /* Update existing parabolas */
          parabs
            .transition()
            .duration(TRANSITION_INTERVAL)
              .attr('ry', function(d, i) {
                return yScale(-100) - yScale(d.level);
              });

          /* Remove parabolas that are no longer bound to data */
          parabs.exit()
            .transition()
            .duration(TRANSITION_INTERVAL)
              .attr('ry', 0)
              .remove();
        };

        var update = function() {
          var data = channelTableDataService.generateData(band);

          updateParabs('plot', data);
          updateParabs('nav', data);

          setTimeout(update, UPDATE_INTERVAL);
        };

        init();

        update();
      },
      function rejected() {
        console.log('channelTableCtrl is unavailable because Cordova is not loaded.');
      }
    )
}]);
