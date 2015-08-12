app.controller('signalStrengthCtrl', ['$scope', '$timeout', 'globalSettings', 'accessPoints',
'setupService', function($scope, $timeout, globalSettings, accessPoints, setupService) {

  setupService.ready.then(function() {

    var gaugeUpdateInterval = constants.updateIntervalFast,
        listUpdateInterval = constants.updateIntervalVerySlow;

    $scope.accessPoints = [];
    $scope.isDuplicateSSID = {};
    $scope.level = undefined;
    $scope.minLevel = undefined;
    $scope.maxLevel = undefined;

    $scope.isSelected = function(ap) {
      if (typeof ap.MAC !== 'undefined') {
        return ap.MAC === selectedMAC;
      }
    };

    $scope.setSelected = function(ap) {
      if (typeof ap.MAC !== 'undefined') {
        selectedMAC = ap.MAC;
      }
      $scope.level = undefined;
      $scope.minLevel = undefined;
      $scope.maxLevel = undefined;
    };

    $scope.sortSSID = utils.customSSIDSort;

    var selectedMAC = "";

    var gauge = (function() {
      var gauge = {};

      // Scale speedometer to device size
      // Initial SVG canvas sizing
      var baseWidth = 400;
      var width = $(window).width() * .6;
      var scale = width / baseWidth;

      var height = $(window).height() * .6;


      // Sets arrow to grey area on gauge - AKA - AP went out of range
      var noSignal = -90;

      // Valid signal strength range on the gauge
      var minSignal = -100;
      var maxSignal = -10;

      var arcRadius = ( baseWidth / 2 ) * scale;
      var arcTransform = 200 * scale;

      var canvasRadius = ( baseWidth / 2 ) * scale;

      var ringWidth = 20 * scale;
      var ringInset = 25 * scale;

      var outerInnerRatio = (7/6);
      var innerRadius = 155 * scale;

      var minMaxArrowHeight = 10 * scale;
      var minMaxArrowWidth = 10 * scale;
      var minMaxArrowOffset = ((outerInnerRatio * innerRadius) - innerRadius ) / 4;

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
      var okSignalEnd = 12.5 * degreesToRads;
      var goodSignalStart = 12.5 * degreesToRads;
      var goodSignalEnd = 90 * degreesToRads;

      var arrowCircleSize = 9 * scale;

      var noSignalFill = "#d3d3d3";
      var badSignalFill = "#cc4748";
      var okSignalFill = "#fdd400";
      var goodSignalFill = "#84b761";
      var blackFill = "#000000";

      var labelFormat = d3.format(',g');
      var labelInset = 15 * scale;
      var numLabels = 10;

      gauge.render = function() {
        // Canvas to draw all elements on
        var vis = d3.select("#gauge").append("svg");

        // Draw arcs
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

        vis.attr("width", width).attr("height", height) // Added height and width so arc is visible
          .append("path")
          .attr("d", noSignalArc)
          .attr("fill", noSignalFill)
          .attr("transform", "translate(" +arcTransform +"," +arcTransform +")");

        vis.append("path")
          .attr("d", badSignalArc)
          .attr("fill", badSignalFill)
          .attr("transform", "translate(" +arcTransform +"," +arcTransform +")");

        vis.append("path")
          .attr("d", okSignalArc)
          .attr("fill", okSignalFill)
          .attr("transform", "translate(" +arcTransform +"," +arcTransform +")");

        vis.append("path")
          .attr("d", goodSignalArc)
          .attr("fill", goodSignalFill)
          .attr("transform", "translate(" +arcTransform +"," +arcTransform +")");

        // Draw circle below arrow
        arrowCircle = vis.append('g')
          .attr("transform", "translate(" +arcTransform +"," +arcTransform +")");

        arrowCircle.append('circle')
          .attr('fill', blackFill)
          .attr('r', arrowCircleSize);

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
          .attr('transform', 'rotate(' +noSignal + ')');

        pointer.append('path')
          .attr('stroke', 'black')
          .attr('stroke-width', 2)
          .attr('d', utils.generateTriangle(arrowCircleSize, (canvasRadius - ringInset - ringWidth)));

        // Draw minimum indicator triangle
        minValueIndicator = arrowCircle.append('g')
          .attr("transform", "rotate(-90)");

        minValueIndicator.append('g')
          //.attr('transform', 'translate(0, ' +(config.ringInset - r)+ ')')
          .attr('transform', 'translate(0, ' +(ringInset - canvasRadius  - minMaxArrowOffset)+ ')')
          .append('path')
          .attr("d", utils.generateTriangle(minMaxArrowWidth, minMaxArrowHeight))
          .attr('transform', 'rotate(180)')
          .attr("fill", blackFill);

        // Draw maximum indicator triangle
        maxValueIndicator = arrowCircle.append('g')
          .attr('transform', 'rotate(-90)');

        maxValueIndicator.append('g')
          .attr('transform', 'translate(0, ' +(ringInset - canvasRadius  - minMaxArrowOffset)+ ')')
          .append('path')
            .attr("d", utils.generateTriangle((minMaxArrowWidth), (minMaxArrowHeight)))
            .attr('transform', 'rotate(180)')
            .attr("fill", blackFill);

        gauge.updateElement('pointer', constants.noSignal);
        gauge.updateElement('minValueIndicator', constants.noSignal);
        gauge.updateElement('maxValueIndicator', constants.noSignal);
      };

      gauge.updateElement = function(elemName, newValue) {
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
            .duration(gaugeUpdateInterval * .8)
            .ease('quad')
            .attr('transform', 'rotate(' +degScale(newValue)+ ')');
          }
        };

        return gauge;
    })();

    var updateList = function() {
      if (! globalSettings.updatesPaused()) {
        accessPoints.getAll().done(function(results) {
          $scope.$apply(function() {
            var encountered = {},
                isDuplicateSSID = {};

            $scope.accessPoints = results;

            for (var i = 0; i < $scope.accessPoints.length; ++i) {
              if (encountered[$scope.accessPoints[i].SSID]) {
                isDuplicateSSID[$scope.accessPoints[i].SSID] = true;
              } else {
                encountered[$scope.accessPoints[i].SSID] = true;
              }
            }

            $scope.isDuplicateSSID = isDuplicateSSID;
          });
        });
      }
    };

    var updateGauge = function() {
      if (! globalSettings.updatesPaused()) {
        accessPoints.get(selectedMAC).done(function(result) {
          $scope.$apply(function() {
            if (result !== null) {
              $scope.level = result.level;

              if ($scope.minLevel === undefined) {
                $scope.minLevel = $scope.level;
              } else if ($scope.level < $scope.minLevel) {
                $scope.minLevel = $scope.level;
              }

              if ($scope.maxLevel === undefined) {
                $scope.maxLevel = $scope.level;
              } else if ($scope.level > $scope.maxLevel) {
                $scope.maxLevel = $scope.level;
              }
            } else {
              $scope.level = constants.noSignal;
            }

            gauge.updateElement('pointer', $scope.level);
            gauge.updateElement('minValueIndicator', $scope.minLevel);
            gauge.updateElement('maxValueIndicator', $scope.maxLevel);
          });
        });
      }
    };

    var init = function() {
      gauge.render();

      var listUpdateLoop = setInterval(updateList, listUpdateInterval),
          gaugeUpdateLoop = setInterval(updateGauge, gaugeUpdateInterval);

      $scope.$on('$destroy', function() {
        clearInterval(listUpdateLoop);
        clearInterval(gaugeUpdateLoop);
      });

    };

    init();

  });

}]);
