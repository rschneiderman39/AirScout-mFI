"use strict";

app.factory('visBuilder', ['setupSequence', function(setupSequence) {

  var service = {};

  setupSequence.done.then(function() {

    /* CONFIG */
    // height
    // width
    // navPercent
    // mainMargins
    // mainDomain
    // labelX
    // range
    // labelY
    // gridLineOpacity
    // yAxisTickInterval
    // xAxisTicks
    // navMargins
    // navLeftDomain
    // navRightDomain
    // navLeftLabel
    // navRightLabel
    // canvasSelector

    service.buildVis = function(elemUpdateFn, elemScrollFn,
      axisScrollFn, bandChangeFn, saveStateFn) {
      var vis = {};

      var band, config;

      var dim = {}, scales = {}, elem = {};

      var hasNav = false;

      vis.init = function(cfg) {
        config = cfg;

        buildMain();

        if (config.navPercent > 0) {
          buildNav();
          hasNav = true;
          setBand(band || config.band);
        }
      };

      vis.update = function() {
        if (hasNav) {
          elemUpdateFn(elem.main.clip, scales.main.x, scales.main.y,
                   elem.main.container, elem.main.axisFn.x, elem.main.axisFn.y,
                   elem.nav.left.clip, scales.nav.left.x,
                   elem.nav.right.clip, scales.nav.right.x,
                   scales.nav.y, band);
        } else {
          elemUpdateFn(elem.main.clip, scales.main.x, scales.main.y,
                   elem.main.axisFn.x, elem.main.axisFn.y);
        }
      };

      vis.saveState = function() {
        saveStateFn(elem.nav.right.slider, scales.nav.right.x, band);
      };

      vis.destroy = function() {
        d3.select(config.canvasSelector).selectAll('*').remove();
      };

      return vis;

      /* Construct the main section of the visualization */
      function buildMain() {
        d3.select(config.canvasSelector)
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
        elem.main.clip = elem.main.container.append('svg')
          .attr('width', dim.main.width)
          .attr('height', dim.main.height);

        scales.main = {};
        elem.main.axisFn = {};

        /* X Axis */
        var numTicks_xAxis = utils.spanLen(config.mainDomain) / config.xAxisTickInterval + 1;

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
        var numTicks_yAxis = utils.spanLen(config.range) / config.yAxisTickInterval + 1;

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
          elem.main.clip.append('path')
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
        d3.select(config.canvasSelector)
          .append('div').attr('id', 'nav-left')
          .style('display', 'inline-block')

        d3.select(config.canvasSelector)
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
        elem.nav.left.clip = elem.nav.left.container.append('svg')
          .attr('width', dim.nav.left.width)
          .attr('height', dim.nav.height);

        scales.nav.left = {};

        /* 2.4 Ghz selector */
        elem.nav.left.clip.append('rect')
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

        elem.nav.right.clip = elem.nav.right.container.append('svg')
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

          axisScrollFn(elem.main.container, elem.main.axisFn.x,
                       scales.main.x, elem.nav.right.slider,
                       scales.nav.right.x, band);

          elemScrollFn(elem.main.clip, scales.main.x);
        };

        var sliderExtent = config.sliderExtent;

        elem.nav.right.slider = elem.nav.right.clip.append('rect')
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
          elem.nav.right.clip.select('.selectable-window').classed('active', false);
          elem.nav.left.clip.select('.selectable-window').classed('active', true);
        } else if (newBand === '5') {
          elem.nav.left.clip.select('.selectable-window').classed('active', false);
          elem.nav.right.clip.select('.selectable-window').classed('active', true);
        }

        band = newBand;

        bandChangeFn(elem.main.clip, scales.main.x, elem.main.container,
                     elem.main.axisFn.x, elem.nav.right.slider,
                     scales.nav.right.x, band);

        vis.update();
      };

    };

  });

  return service;

}]);
