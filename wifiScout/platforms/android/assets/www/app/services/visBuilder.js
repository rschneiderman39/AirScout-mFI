"use strict";

app.factory('visBuilder', ['setupService', function(setupService) {

  var service = {};

  setupService.ready.then(function() {

    /* CONFIG */
    // height
    // width
    // navPercent
    // graphMargins
    // graphDomain
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

    service.buildVis = function(config, elemUpdateFn, elemScrollFn,
      axisScrollFn, bandChangeFn, saveStateFn) {
      var vis = {};

      var band;

      var dim = {}, scales = {}, elem = {};

      var hasNav = false;

      vis.update = function() {
        if (hasNav) {
          elemUpdateFn(elem.graph.clip, scales.graph.x, scales.graph.y,
                   elem.graph.container, elem.graph.axisFn.x, elem.graph.axisFn.y,
                   elem.nav.left.clip, scales.nav.left.x,
                   elem.nav.right.clip, scales.nav.right.x,
                   scales.nav.y, band);
        } else {
          elemUpdateFn(elem.graph.clip, scales.graph.x, scales.graph.y,
                   elem.graph.axisFn.x, elem.graph.axisFn.y);
        }

      };

      vis.saveState = function() {
        saveStateFn(elem.nav.right.slider, scales.nav.right.x, band);
      };

      buildGraph();

      if (config.navPercent > 0) {
        buildNav();
        hasNav = true;
        setBand(config.band);
      }

      return vis;

      /* Derive graph dimensions and add elements to DOM */
      function buildGraph() {
        d3.select('#vis')
          .append('div').attr('id', 'graph');

        dim.graph = {};

        /* Dimensions */
        dim.graph.totalHeight = config.height * (1 - config.navPercent);

        dim.graph.margins = config.graphMargins;

        dim.graph.width = config.width - dim.graph.margins.left - dim.graph.margins.right;
        dim.graph.height = dim.graph.totalHeight - dim.graph.margins.top - dim.graph.margins.bottom;

        elem.graph = {};

        /* Container */
        elem.graph.container = d3.select('#graph').classed('chart', true).append('svg')
          .attr('width', config.width)
          .attr('height', dim.graph.totalHeight)
          .append('g')
            .attr('transform', 'translate(' + dim.graph.margins.left + ',' + dim.graph.margins.top + ')');

        /* Clip-path */
        elem.graph.clip = elem.graph.container.append('g')
          .attr('clip-path', 'url(#graph-clip)')

        elem.graph.clip.append('clipPath')
          .attr('id', 'graph-clip')
          .append('rect')
            .attr('width', dim.graph.width)
            .attr('height', dim.graph.height);

        scales.graph = {};
        elem.graph.axisFn = {};

        /* X Axis */
        var numTicks_xAxis = utils.spanLen(config.graphDomain) / config.xAxisTickInterval + 1;

        scales.graph.x = d3.scale.linear()
          .domain(config.graphDomain)
          .range([0, dim.graph.width]);

        elem.graph.axisFn.x = d3.svg.axis()
          .scale(scales.graph.x)
          .orient('bottom')
          .ticks(numTicks_xAxis)
          .tickSize(1);

        elem.graph.container.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + dim.graph.height + ')')
          .call(elem.graph.axisFn.x);

        /* X Label */
        elem.graph.container.append('text')
          .text(config.labelX)
          .classed('axis-label', true)
          .attr('x', function() {
            return (dim.graph.width / 2) - (this.getBBox().width / 2);
          })
          .attr('y', dim.graph.height + dim.graph.margins.bottom - 1);

        /* Y Axis */
        var numTicks_yAxis = utils.spanLen(config.range) / config.yAxisTickInterval + 1;

        scales.graph.y = d3.scale.linear()
          .domain(config.range)
          .range([dim.graph.height, 0]);

        elem.graph.axisFn.y = d3.svg.axis()
          .scale(scales.graph.y)
          .orient('left')
          .ticks(numTicks_yAxis)
          .tickSize(1);

        elem.graph.container.append('g')
          .attr('class', 'y axis')
          .call(elem.graph.axisFn.y);

        /* Y Label */
        elem.graph.container.append('text')
          .classed('axis-label', true)
          .text(config.labelY)
          .attr('transform', function() {
            return 'rotate(-90) translate(-' + dim.graph.totalHeight/2 + ', -' + this.getBBox().width/2.5 + ')';
          });

        /* Grid lines */
        for (var i = 1; i < numTicks_yAxis; ++i) {
          elem.graph.clip.append('path')
            .attr('stroke', 'black')
            .style('opacity', config.gridLineOpacity)
            .attr('d', function() {
              var y = scales.graph.y(config.range[0] + i * config.yAxisTickInterval);
              return 'M 0 ' + y + ' H ' + dim.graph.width + ' ' + y;
            });
        }

        /* Border */
        elem.graph.container.append('rect')
          .attr('width', dim.graph.width - 1)
          .attr('height', dim.graph.height)
          .attr('stroke', 'black')
          .attr('stroke-width', '1')
          .attr('fill', 'transparent')
          .attr('pointer-events', 'none');
      };

      /* Derive navigator dimensions and add elments to DOM */
      function buildNav() {
        d3.select('#vis')
          .append('div').attr('id', 'nav-left')
          .classed('nav-pane', true)

        d3.select('#vis')
          .append('div').attr('id', 'nav-right')
          .classed('nav-pane', true)

        dim.nav = {};

        /* Dimensions */
        dim.nav.totalHeight = config.height * config.navPercent;

        dim.nav.margins = config.navMargins;

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
          .attr('width', dim.nav.left.totalWidth)
          .attr('height', dim.nav.totalHeight)
          .append('g')
            .attr('transform', 'translate(' + dim.nav.margins.left + ',' + dim.nav.margins.top + ')');

        /* Clip-path */
        elem.nav.left.clip = elem.nav.left.container.append('g')
          .attr('clip-path', 'url(#nav-clip-left)')

        elem.nav.left.clip.append('clipPath')
          .attr('id', 'nav-clip-left')
          .append('rect')
            .attr('width', dim.nav.left.width)
            .attr('height', dim.nav.height);

        scales.nav.left = {};

        /* 2.4 Ghz selector */
        elem.nav.left.clip.append('rect')
          .classed('nav-toggle-left', true)
          .attr('width', dim.nav.left.width)
          .attr('height', dim.nav.height)
          .on('touchstart', function() {
            d3.event.preventDefault();
            d3.event.stopPropagation();
            setBand('2_4');
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
          .attr('width', dim.nav.right.totalWidth)
          .attr('height', dim.nav.totalHeight)
          .append('g')
            .classed('navigator', true)
            .attr('transform', 'translate(0, ' + dim.nav.margins.top + ')');

        elem.nav.right.clip = elem.nav.right.container.append('g')
          .attr('clip-path', 'url(#nav-clip-right)');

        elem.nav.right.clip.append('clipPath')
          .attr('id', 'nav-clip-right')
          .append('rect')
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

          setBand('5');

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

          axisScrollFn(elem.graph.container, elem.graph.axisFn.x,
                       scales.graph.x, elem.nav.right.slider,
                       scales.nav.right.x, band);

          elemScrollFn(elem.graph.clip, scales.graph.x);
        };

        var sliderExtent = config.sliderExtent;

        elem.nav.right.slider = elem.nav.right.clip.append('rect')
          .classed('nav-toggle-right', true)
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
          .attr('y', dim.nav.height + dim.nav.margins.bottom);

        elem.nav.right.container.append('text')
          .text(config.navRightLabel)
          .attr('y', dim.nav.height + dim.nav.margins.bottom);
      };

      function setBand(newBand) {
        if (newBand !== band) {
          if (newBand ===  '2_4') {
            elem.nav.right.clip.select('.nav-toggle-right').classed('active', false);
            elem.nav.left.clip.select('.nav-toggle-left').classed('active', true);
          } else if (newBand === '5') {
            elem.nav.left.clip.select('.nav-toggle-left').classed('active', false);
            elem.nav.right.clip.select('.nav-toggle-right').classed('active', true);
          }

          band = newBand;

          bandChangeFn(elem.graph.clip, scales.graph.x, elem.graph.container,
                       elem.graph.axisFn.x, elem.nav.right.slider,
                       scales.nav.right.x, band);

          vis.update();
        }
      };

    };

  });

  return service;

}]);
