app.controller('signalStrengthCtrl', ['$scope', '$timeout', 'globalSettings', 'accessPoints',
'setupService', function($scope, $timeout, globalSettings, accessPoints, setupService) {
  setupService.ready.then(function() {

    var transitionTime = 2000;

    // Sets arrow to grey area on gauge - AKA - AP went out of range
    var noSignal = -90;

    // Valid signal strength range on the gauge
    var minSignal = -100;
    var maxSignal = -10;

    var renderGauge = function() {
      var arcHeights = "400";
      var arcWidths = "400";
      var arcRadius = arcWidths / 2;
      var arcTransform = "translate(200,200)";

      var gaugeSizeRatio = .84;
      var gaugeRatio = ($(window).width() * 0.66 / arcWidths) * gaugeSizeRatio;

      var minMaxArrowHeight = 10;
      var minMaxArrowWidth = 10;
      var minMaxArrowInset = 40;

      var pointerLength = arcWidths / 2;
      var pointerWidth = 20;
      var pointerInset = 31;

      var outerInnerRatio = (175/150);
      var innerRadius = 150;

      var minValue = -100;
      var maxValue = -10;

      var minAngle = -84;
      var maxAngle = 90;

      var pi = Math.PI;
      var degreesToRads = (pi/180);
      var noSignalStart = -90 * degreesToRads; //converting from degs to radians
      var noSignalEnd = -84 * degreesToRads;
      var badSignalStart = -84 * degreesToRads;
      var badSignalEnd = -45 * degreesToRads;
      var okSignalStart = -45 * degreesToRads;
      var okSignalEnd = 13 * degreesToRads;
      var goodSignalStart = 13 * degreesToRads;
      var goodSignalEnd = 90 * degreesToRads;

      var arrowCircleSize = 10;

      var noSignalFill = "#d3d3d3";
      var badSignalFill = "#cc4748";
      var okSignalFill = "#fdd400";
      var goodSignalFill = "#84b761";
      var blackFill = "#000000";

      var labelFormat = d3.format(',g');
      var labelInset = 15;
      var numLabels = 10;

      // Canvas to draw all elements on
      var vis = d3.select("#test").append("svg");

      // Draw Arcs
      var noSignalArc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(innerRadius * outerInnerRatio)
        .startAngle(noSignalStart)
        .endAngle(noSignalEnd)

      var badSignalArc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(innerRadius * outerInnerRatio)
        .startAngle(badSignalStart)
        .endAngle(badSignalEnd)

      var okSignalArc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(innerRadius * outerInnerRatio)
        .startAngle(okSignalStart)
        .endAngle(okSignalEnd)

      var goodSignalArc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(innerRadius * outerInnerRatio)
        .startAngle(goodSignalStart)
        .endAngle(goodSignalEnd)

      vis.attr("width", arcWidths).attr("height", arcHeights) // Added height and width so arc is visible
        .append("path")
        .attr("d", noSignalArc)
        .attr("fill", noSignalFill)
        .attr("transform", arcTransform);

      vis.attr("width", arcWidths).attr("height", arcHeights)
        .append("path")
        .attr("d", badSignalArc)
        .attr("fill", badSignalFill)
        .attr("transform", arcTransform);

      vis.attr("width", arcWidths).attr("height", arcHeights)
        .append("path")
        .attr("d", okSignalArc)
        .attr("fill", okSignalFill)
        .attr("transform", arcTransform);

      vis.attr("width", arcWidths).attr("height", arcHeights)
        .append("path")
        .attr("d", goodSignalArc)
        .attr("fill", goodSignalFill)
        .attr("transform", arcTransform);

      // Draw circle below arrow
      arrowCircle = vis.append('g')
        .attr("transform", arcTransform);

      arrowCircle.append('circle')
        .attr('fill', blackFill)
        .attr('r', arrowCircleSize * gaugeRatio);

      // Scale for text formatting around arcs
      scale = d3.scale.linear()
        .domain([minValue, maxValue])
        .range([0,1]);

      degScale = d3.scale.linear()
        .domain([minValue, maxValue])
        .range([minAngle, maxAngle]);

      ticks = scale.ticks(numLabels);

      // Draw text labels on arc
      var arcLabels = arrowCircle.append('g')
            .attr('class', 'label');

      arcLabels.selectAll('text')
          .data(ticks)
          .enter().append('text')
            .text(labelFormat)
            .attr('transform', function(d) {
              return 'rotate(' +degScale(d) +') translate(0,' +(labelInset - arcRadius)+ ')';
            });

      // Draw arrow
      pointer = arrowCircle.append('g')
        .attr('transform', 'rotate(' +noSignal+ ')');

      pointer.append('path')
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('d', utils.generateTriangle((arrowCircleSize * gaugeRatio), (pointerLength - pointerInset - pointerWidth)));
        //.attr('d', utils.generateTriangle(8, 149));

      // Draw minimum indicator triangle
      minValueIndicator = arrowCircle.append('g')
        .attr("transform", "rotate(-90)");

      minValueIndicator.append('g')
        //.attr('transform', 'translate(0, ' +(config.ringInset - r)+ ')')
        .attr('transform', 'translate(0, ' +(minMaxArrowInset - pointerLength)+ ')')
        .append('path')
        .attr("d", utils.generateTriangle((minMaxArrowWidth * gaugeRatio), (minMaxArrowHeight * gaugeRatio)))
        .attr('transform', 'rotate(180)')
        .attr("fill", blackFill);

      // Draw maximum indicator triangle
      maxValueIndicator = arrowCircle.append('g')
        .attr('transform', 'rotate(-90)');

      maxValueIndicator.append('g')
        .attr('transform', 'translate(0, ' +(minMaxArrowInset - pointerLength)+ ')')
        .append('path')
          .attr("d", utils.generateTriangle((minMaxArrowWidth * gaugeRatio), (minMaxArrowHeight * gaugeRatio)))
          .attr('transform', 'rotate(180)')
          .attr("fill", blackFill);

      //updateGauge('pointer', newValue === undefined ? noSignal : newValue);
      //updateGauge('minValueIndicator', newValue === undefined ? noSignal : newValue);
      //updateGauge('maxValueIndicator', newValue === undefined ? noSignal : newValue);

      updateGauge('minValueIndicator', -10);
      updateGauge('pointer', -10);
    };

    function updateGauge(elemName, newValue) {
      if (newValue !== undefined) {
        if (newValue > maxSignal) {
          newValue = maxSignal;
        } 
        else if (newValue < minSignal) {
          newValue = noSignal;
        }

        if (elemName === 'pointer') {
          elem = pointer;
        } 
        else if (elemName === 'minValueIndicator') {
          elem = minValueIndicator;
        } 
        else if (elemName === 'maxValueIndicator') {
          elem = maxValueIndicator;
        }

        elem.transition()
          .duration(transitionTime)
          .ease('quad')
          .attr('transform', 'rotate(' +degScale(newValue)+ ')');
        }
      };

    function initGauge() {
      renderGauge();
    };

    initGauge();
  });
}]);
