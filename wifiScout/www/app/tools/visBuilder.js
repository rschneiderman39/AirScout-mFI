"use strict";

app.factory('visBuilder', ['utils', 'setupSequence', function(utils,
setupSequence) {

  var service = {};

  setupSequence.done.then(function() {

    /* CONFIG
    height:      Total height of visualization in pixels

    width:       Total width of visualization in pixels

    navPercent:  Percentage of visualization to be occupied by nav pane. Set
                 to 0 to disable the navigation pane entirely.

    mainMargins: {left: , right:, top:, bottom: } Margins, in pixels, of main pane

    mainDomain:  Inclusive extent of the main pane's X axis

    labelX:      Label applied to the X axis of the main pane

    range:       Inlusive extent of the main pane's Y axis

    labelY:      Label applied to main pane's Y axis

    gridLineOpacity:   The opacity of the horizontal gridlines

    yAxisTickInterval: Number of units between Y axis ticks on main pane

    navMargins: {left: , right:, top:, bottom: } Margins, in pixels, of nav pane

    navLeftDomain: Inclusive domain of left navigation pane

    navRightDomain: Inclusive domain of right navigation pane

    navLeftLabel:  Text to be placed below left navigation pane

    navRightLabel: Text to be placed below right navigation pane

    elemUpdateFn:  The function used to generate and update elements

    elemScrollFn:  The function used to translate elements when the visualization
                   is scrolled.

    axisScrollFn: The function used to adjust the axis when the visualization is
                  scrolled.

    bandChangeFn: The function to be invoked when the user selects a different
                  band from the navigation pane

    saveStateFn:  A function that can be triggered by calling saveState
                  on the returned visualization
    */

    service.newVisualization = function(canvasSelector) {
      var vis = {};

      var band, config, hasNav = false;

      var dim = {}, scales = {}, elem = {};

      vis.init = function(cfg) {
        config = cfg;

        buildMain();

        if (config.navPercent > 0) {
          hasNav = true;
          buildNav();
          setBand(band || config.band);
        }
      };

      vis.update = function() {
        var dependencies = {
          mainCanvas: elem.main.canvas,
          mainScaleX: scales.main.x,
          mainScaleY: scales.main.y,
          mainContainer: elem.main.container,
          mainAxisFnX: elem.main.axisFn.x,
          mainAxisFnY: elem.main.axisFn.y,
          navLeftCanvas: hasNav ? elem.nav.left.canvas : undefined,
          navLeftScaleX: hasNav ? scales.nav.left.x : undefined,
          navRightCanvas: hasNav ? elem.nav.right.canvas : undefined,
          navRightScaleX: hasNav ? scales.nav.right.x : undefined,
          navScaleY: hasNav ? scales.nav.y : undefined,
          band: band
        };

        config.elemUpdateFn(dependencies);
      };

      vis.saveState = function() {
        var dependencies = {
          slider: hasNav ? elem.nav.right.slider : undefined,
          navRightScaleX: hasNav ? scales.nav.right.x : undefined
        };

        config.saveStateFn(dependencies);
      };

      vis.destroy = function() {
        d3.select(canvasSelector).selectAll('*').remove();
      };

      return vis;

      /* Construct the main section of the visualization */
      function buildMain() {
        d3.select(canvasSelector)
          .append('div').attr('id', 'main');

        dim.main = {};

        /* Dimensions */
        dim.main.totalHeight = config.height * (1 - config.navPercent);

        dim.main.margins = {
          left: config.mainMargins.left,
          right: config.mainMargins.right,
          top: config.mainMargins.top,
          bottom: config.mainMargins.bottom
        };

        dim.main.width = config.width - dim.main.margins.left - dim.main.margins.right;
        dim.main.height = dim.main.totalHeight - dim.main.margins.top - dim.main.margins.bottom;

        elem.main = {};

        /* Container */
        elem.main.container = d3.select('#main').append('svg')
          .style('display', 'block')
          .attr('width', config.width)
          .attr('height', dim.main.totalHeight)
          .append('g')
            .attr('transform', 'translate(' + dim.main.margins.left + ',' + dim.main.margins.top + ')');

        /* Clip-path */
        elem.main.canvas = elem.main.container.append('svg')
          .attr('width', dim.main.width)
          .attr('height', dim.main.height);

        scales.main = {};
        elem.main.axisFn = {};

        /* X Axis */
        var numTicks_xAxis = (config.mainDomain[1] - config.mainDomain[0]) /
                             config.xAxisTickInterval + 1;

        scales.main.x = d3.scale.linear()
          .domain(config.mainDomain)
          .range([0, dim.main.width]);

        elem.main.axisFn.x = d3.svg.axis()
          .scale(scales.main.x)
          .orient('bottom')
          .ticks(numTicks_xAxis)
          .tickSize(1);

        elem.main.container.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + dim.main.height + ')')
          .call(elem.main.axisFn.x);

        /* X Label */
        elem.main.container.append('text')
          .text(config.labelX)
          .classed('axis-label', true)
          .attr('x', function() {
            return (dim.main.width / 2) - (this.getBBox().width / 2);
          })
          .attr('y', dim.main.height + dim.main.margins.bottom - 1);

        /* Y Axis */
        var numTicks_yAxis = (config.range[1] - config.range[0]) /
                              config.yAxisTickInterval + 1;

        scales.main.y = d3.scale.linear()
          .domain(config.range)
          .range([dim.main.height, 0]);

        elem.main.axisFn.y = d3.svg.axis()
          .scale(scales.main.y)
          .orient('left')
          .ticks(numTicks_yAxis)
          .tickSize(1);

        elem.main.container.append('g')
          .attr('class', 'y axis')
          .call(elem.main.axisFn.y);

        /* Y Label */
        elem.main.container.append('text')
          .classed('axis-label', true)
          .text(config.labelY)
          .attr('transform', function() {
            return 'rotate(-90) translate(-' + dim.main.totalHeight/2 + ', -' + this.getBBox().width/2.5 + ')';
          });

        /* Grid lines */
        for (var i = 1; i < numTicks_yAxis; ++i) {
          elem.main.canvas.append('path')
            .attr('stroke', 'black')
            .style('opacity', config.gridLineOpacity)
            .attr('d', function() {
              var y = scales.main.y(config.range[0] + i * config.yAxisTickInterval);
              return 'M 0 ' + y + ' H ' + dim.main.width + ' ' + y;
            });
        }

        /* Border */
        elem.main.container.append('rect')
          .attr('width', dim.main.width - 1)
          .attr('height', dim.main.height)
          .attr('stroke', 'black')
          .attr('stroke-width', '1')
          .attr('fill', 'transparent')
          .attr('pointer-events', 'none');
      };

      /* Derive navigator dimensions and add elments to DOM */
      function buildNav() {
        d3.select(canvasSelector)
          .append('div').attr('id', 'nav-left')
          .style('display', 'inline-block')

        d3.select(canvasSelector)
          .append('div').attr('id', 'nav-right')
          .style('display', 'inline-block')

        dim.nav = {};

        /* Dimensions */
        dim.nav.totalHeight = config.height * config.navPercent;

        dim.nav.margins = {
          left: config.navMargins.left,
          right: config.navMargins.right,
          top: config.navMargins.top,
          bottom: config.navMargins.bottom
        };

        dim.nav.width = config.width - dim.nav.margins.left - dim.nav.margins.right;
        dim.nav.height = dim.nav.totalHeight - dim.nav.margins.top - dim.nav.margins.bottom;

        scales.nav = {};

        /* Y Scale */
        scales.nav.y = d3.scale.linear()
          .domain(config.range)
          .range([dim.nav.height, 0]);

        /* 2.4 Ghz Portion */
        dim.nav.left = {};

        /* Dimensions */
        dim.nav.left.width = dim.nav.width * config.navLeftPercent;
        dim.nav.left.totalWidth = dim.nav.left.width + dim.nav.margins.left;

        elem.nav = {};
        elem.nav.left = {};

        /* Container */
        elem.nav.left.container = d3.select('#nav-left').append('svg')
          .style('display', 'block')
          .attr('width', dim.nav.left.totalWidth)
          .attr('height', dim.nav.totalHeight)
          .append('g')
            .attr('transform', 'translate(' + dim.nav.margins.left + ',' + dim.nav.margins.top + ')');

        /* Clip-path */
        elem.nav.left.canvas = elem.nav.left.container.append('svg')
          .attr('width', dim.nav.left.width)
          .attr('height', dim.nav.height);

        scales.nav.left = {};

        /* 2.4 Ghz selector */
        elem.nav.left.canvas.append('rect')
          .classed('selectable-window', true)
          .attr('width', dim.nav.left.width)
          .attr('height', dim.nav.height)
          .on('touchstart', function() {
            d3.event.preventDefault();
            d3.event.stopPropagation();
            if (band !== '2_4') setBand('2_4');
          })
          .on('touchend', function() {
            d3.event.preventDefault();
            d3.event.stopPropagation();
          })
          .on('click', function() {
            d3.event.preventDefault();
            d3.event.stopPropagation();
          });

        /* X Scale */
        scales.nav.left.x = d3.scale.linear()
          .domain(config.navLeftDomain)
          .range([0, dim.nav.left.width]);

        /* 5 Ghz Portion */
        dim.nav.right = {};

        /* Dimensions */
        dim.nav.right.width = dim.nav.width * (1 - config.navLeftPercent);
        dim.nav.right.totalWidth = dim.nav.right.width + dim.nav.margins.right;

        elem.nav.right = {};

        /* Container */
        elem.nav.right.container = d3.select('#nav-right').append('svg')
          .style('display', 'block')
          .attr('width', dim.nav.right.totalWidth)
          .attr('height', dim.nav.totalHeight)
          .append('g')
            .classed('navigator', true)
            .attr('transform', 'translate(0, ' + dim.nav.margins.top + ')');

        elem.nav.right.canvas = elem.nav.right.container.append('svg')
          .attr('width', dim.nav.right.width)
          .attr('height', dim.nav.height);

        scales.nav.right = {};

        scales.nav.right.x = d3.scale.linear()
          .domain(config.navRightDomain)
          .range([0, dim.nav.right.width]);

        /* Slider */
        var touchStartX, sliderStartX;

        function onTouchStart() {
          d3.event.preventDefault();
          d3.event.stopPropagation();

          if (band !== '5') setBand('5');

          touchStartX = d3.event.changedTouches[0].screenX -
            $('#nav-right')[0].getBoundingClientRect().left;

          sliderStartX = parseFloat(elem.nav.right.slider.attr('x'));
        };

        function onTouchMove() {
          var touchX, sliderX, xScale, slider;

          d3.event.preventDefault();
          d3.event.stopPropagation();

          touchX = d3.event.changedTouches[0].screenX -
            $('#nav-right')[0].getBoundingClientRect().left;

          sliderX = sliderStartX + (touchX - touchStartX);

          slider = elem.nav.right.slider;
          xScale = scales.nav.right.x;

          if (sliderX < xScale.range()[0]) {
            sliderX = xScale.range()[0];
          } else if (sliderX + parseFloat(slider.attr('width')) > xScale.range()[1]) {
            sliderX = xScale.range()[1] - parseFloat(slider.attr('width'));
          }

          slider.attr('x', sliderX);

          var dependencies = {
            mainContainer: elem.main.container,
            mainAxisFnX: elem.main.axisFn.x,
            mainScaleX: scales.main.x,
            slider: hasNav ? elem.nav.right.slider : undefined,
            navRightScaleX: hasNav ? scales.nav.right.x: undefined,
            band: band
          };

          config.axisScrollFn(dependencies);

          dependencies = {
            mainCanvas: elem.main.canvas,
            mainScaleX: scales.main.x
          };

          config.elemScrollFn(dependencies);
        };

        var sliderExtent = config.sliderExtent;

        elem.nav.right.slider = elem.nav.right.canvas.append('rect')
          .classed('selectable-window', true)
          .attr('x', function() {
            return scales.nav.right.x(sliderExtent[0]);
          })
          .attr('width', function() {
            return scales.nav.right.x(sliderExtent[1]) -
                   scales.nav.right.x(sliderExtent[0]);
          })
          .attr('height', dim.nav.height)
          .on('touchstart', onTouchStart)
          .on('touchmove', onTouchMove)
          .on('touchend', function() {
            d3.event.preventDefault();
            d3.event.stopPropagation();
          })
          .on('click', function() {
            d3.event.preventDefault();
            d3.event.stopPropagation();
          });

        /* Borders */
        elem.nav.left.container.append('rect')
          .attr('width', dim.nav.left.width - 1)
          .attr('height', dim.nav.height)
          .attr('stroke', 'black')
          .attr('stroke-width', '1')
          .attr('fill', 'transparent')
          .attr('pointer-events', 'none');

        elem.nav.right.container.append('rect')
          .attr('width', dim.nav.right.width - 1)
          .attr('height', dim.nav.height)
          .attr('stroke', 'black')
          .attr('stroke-width', '1')
          .attr('fill', 'transparent')
          .attr('pointer-events', 'none');

        /* Labels */
        elem.nav.left.container.append('text')
          .text(config.navLeftLabel)
          .attr('y', dim.nav.height + dim.nav.margins.bottom - 1);

        elem.nav.right.container.append('text')
          .text(config.navRightLabel)
          .attr('y', dim.nav.height + dim.nav.margins.bottom - 1);
      };

      function setBand(newBand) {
        if (newBand ===  '2_4') {
          elem.nav.right.canvas.select('.selectable-window').classed('active', false);
          elem.nav.left.canvas.select('.selectable-window').classed('active', true);
        } else if (newBand === '5') {
          elem.nav.left.canvas.select('.selectable-window').classed('active', false);
          elem.nav.right.canvas.select('.selectable-window').classed('active', true);
        }

        band = newBand;

        var dependencies = {
          mainCanvas: elem.main.canvas,
          mainScaleX: scales.main.x,
          mainContainer: elem.main.container,
          mainAxisFnX: elem.main.axisFn.x,
          slider: elem.nav ? elem.nav.right.slider : undefined,
          navRightScaleX: scales.nav ? scales.nav.right.x: undefined,
          band: band
        };

        config.bandChangeFn(dependencies);

        vis.update();
      };

    };

  });

  return service;

}]);
