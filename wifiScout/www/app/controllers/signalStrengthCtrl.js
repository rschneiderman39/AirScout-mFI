app.controller('signalStrengthCtrl', ['$scope', '$timeout', 'globalSettings', 'accessPoints',
'setupService', function($scope, $timeout, globalSettings, accessPoints, setupService) {
  setupService.ready.then(function() {

    var makeGauge = function() {
      var outerInnerRatio = (175/150);
      var innerRadius = 150;

      var arcHeights = "400";
      var arcWidths = "400";
      var arcTransform = "translate(200,200)";

      var minValue = -100;
      var maxValue = -10;

      var minAngle = -86;
      var maxAngle = 86;

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

      var noSignalFill = "#d3d3d3";
      var badSignalFill = "#cc4748";
      var okSignalFill = "#fdd400";
      var goodSignalFill = "#84b761";

      var labelFormat = d3.format(',g');
      var labelInset = 15;

      var arcRadius = arcWidths / 2;

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
      center = vis.append('g')
        .attr("transform", "translate(200,200)");

      center.append('circle')
        .attr('fill', 'black')
        .attr('r', 9);

      // Scale for text formatting around arcs
      scale = d3.scale.linear()
        .domain([minValue, maxValue])
        .range([0,1]);

      degScale = d3.scale.linear()
        .domain([minValue, maxValue])
        .range([minAngle, maxAngle]);

      ticks = scale.ticks(10);

      // Draw text labels on arc
      var arcLabels = center.append('g')
            .attr('class', 'label');

      arcLabels.selectAll('text')
          .data(ticks)
          .enter().append('text')
            .text(labelFormat)
            .attr('transform', function(d) {
              //+(config.labelInset - r)+ 
              return 'rotate(' +degScale(d) +') translate(0,' +(labelInset - arcRadius)+ ')';
            });

      // Draw arrow
      pointer = center.append('g')
        .attr("transform", "rotate(-90)");

      pointer.append('path')
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('d', utils.generateTriangle(8, 149));

      // Draw minimum indicator triangle
      minValue = center.append('g')
        .attr("transform", "rotate(-90)");

      minValue.append('g')
        .attr("transform", "translate(0, -160)")
        .append('path')
        .attr("d", utils.generateTriangle(12,12))
        .attr('transform', 'rotate(180)')
        .attr("fill", "#000");

      // Draw maximum indicator triangle
      maxValue = center.append('g')
        .attr('transform', 'rotate(-90)');

      maxValue.append('g')
        .attr('transform', 'translate(0, -160)')
        .append('path')
          .attr("d", utils.generateTriangle(12,12))
          .attr('transform', 'rotate(180)')
          .attr("fill", "#000");
    };
    makeGauge();
  });
}]);