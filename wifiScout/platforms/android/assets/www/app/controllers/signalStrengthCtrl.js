"use strict";

app.controller('signalStrengthCtrl', ['$scope', '$timeout', 'globalSettings', 'accessPoints',
'setupService', function($scope, $timeout, globalSettings, accessPoints, setupService) {

  setupService.ready.then(function() {

    var gaugeUpdateInterval = constants.updateIntervalNormal,
        listUpdateInterval = 5000;

    var prefs = {
      badSignalThresh: -95,
      okSignalThresh: -80,
      goodSignalThresh: -55,
      noSignalFill: "#d3d3d3",
      badSignalFill: "#cc4748",
      okSignalFill: "#fdd400",
      goodSignalFill: "#84b761"
    };

    $scope.accessPoints = [];
    $scope.isDuplicateSSID = {};
    $scope.level = undefined;
    $scope.minLevel = undefined;
    $scope.maxLevel = undefined;

    $scope.selectedSSID = undefined;
    $scope.selectedBSSID = undefined;

    $scope.isSelected = function(ap) {
      if (typeof ap.MAC !== 'undefined') {
        return ap.MAC === selectedMAC;
      }
    };

    $scope.setSelected = function(ap) {
      if (typeof ap.MAC !== 'undefined') {
        selectedMAC = ap.MAC;

        $scope.selectedSSID = ap.SSID;
        $scope.selectedBSSID = ap.MAC;
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
      var height = $(window).height() * .6;

      var scaleFactor = width / baseWidth;

      // Sets arrow to grey area on gauge - AKA - AP went out of range
      var minAngle = -90,
          maxAngle = 90;

      var minLevelAngle = -84,
          maxLevelAngle = 90;

      // Scale for text formatting around arcs
      var scale = d3.scale.linear()
        .domain([constants.noSignal, constants.maxSignal])
        .range([0,1])

      var ticks = scale.ticks(numLabels);

      var levelDegScale = d3.scale.linear()
        .domain([constants.noSignal, constants.maxSignal])
        .range([minLevelAngle, maxLevelAngle]);

      var arcDegScale = d3.scale.linear()
        .domain([constants.noSignal, constants.maxSignal])
        .range([minAngle, maxAngle]);

      var degreesToRads = Math.PI / 180;

      // Valid signal strength range on the gauge
      var arcRadius = ( baseWidth / 2 ) * scaleFactor;
      var arcTransform = 200 * scaleFactor;

      var canvasRadius = ( baseWidth / 2 ) * scaleFactor;

      var ringWidth = 20 * scaleFactor;
      var ringInset = 25 * scaleFactor;

      var outerInnerRatio = (7/6);
      var innerRadius = 155 * scaleFactor;

      var minMaxArrowHeight = 10 * scaleFactor;
      var minMaxArrowWidth = 10 * scaleFactor;
      var minMaxArrowOffset = ((outerInnerRatio * innerRadius) - innerRadius ) / 4;

      var noSignalStart = arcDegScale(constants.noSignal) * degreesToRads,
          badSignalStart = arcDegScale(prefs.badSignalThresh) * degreesToRads,
          okSignalStart = arcDegScale(prefs.okSignalThresh) * degreesToRads,
          goodSignalStart = arcDegScale(prefs.goodSignalThresh) * degreesToRads;

      var arrowCircleSize = 9 * scaleFactor;

      var labelFormat = d3.format(',g');
      var labelInset = 15 * scaleFactor;
      var numLabels = 10;

      var pointer, minValueIndicator, maxValueIndicator;

      gauge.render = function() {
        // Canvas to draw all elements on
        var vis = d3.select("#gauge").append("svg");

        // Draw arcs
        var noSignalArc = d3.svg.arc()
          .innerRadius(innerRadius)
          .outerRadius(innerRadius * outerInnerRatio)
          .startAngle(noSignalStart)
          .endAngle(badSignalStart)

        var badSignalArc = d3.svg.arc()
          .innerRadius(innerRadius)
          .outerRadius(innerRadius * outerInnerRatio)
          .startAngle(badSignalStart)
          .endAngle(okSignalStart)

        var okSignalArc = d3.svg.arc()
          .innerRadius(innerRadius)
          .outerRadius(innerRadius * outerInnerRatio)
          .startAngle(okSignalStart)
          .endAngle(goodSignalStart)

        var goodSignalArc = d3.svg.arc()
          .innerRadius(innerRadius)
          .outerRadius(innerRadius * outerInnerRatio)
          .startAngle(goodSignalStart)
          .endAngle(maxAngle * degreesToRads)

        vis.attr("width", width).attr("height", height) // Added height and width so arc is visible
          .append("path")
          .attr("d", noSignalArc)
          .attr("fill", prefs.noSignalFill)
          .attr("transform", "translate(" +arcTransform +"," +arcTransform +")");

        vis.append("path")
          .attr("d", badSignalArc)
          .attr("fill", prefs.badSignalFill)
          .attr("transform", "translate(" +arcTransform +"," +arcTransform +")");

        vis.append("path")
          .attr("d", okSignalArc)
          .attr("fill", prefs.okSignalFill)
          .attr("transform", "translate(" +arcTransform +"," +arcTransform +")");

        vis.append("path")
          .attr("d", goodSignalArc)
          .attr("fill", prefs.goodSignalFill)
          .attr("transform", "translate(" +arcTransform +"," +arcTransform +")");

        // Draw circle below arrow
        var arrowCircle = vis.append('g')
          .attr("transform", "translate(" +arcTransform +"," +arcTransform +")");

        arrowCircle.append('circle')
          .attr('fill', 'black')
          .attr('r', arrowCircleSize);

        // Draw text labels on arc
        var arcLabels = arrowCircle.append('g')
              .attr('class', 'label');

        arcLabels.selectAll('text')
          .data(ticks)
          .enter().append('text')
            .text(labelFormat)
            .attr('transform', function(d) {
              return 'rotate(' +arcDegScale(d) +') translate(0,' +(labelInset - arcRadius)+ ')';
            });

        // Draw arrow
        pointer = arrowCircle.append('g')
          .attr('transform', 'rotate(' + minAngle + ')');

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
          .attr("fill", 'black');

        // Draw maximum indicator triangle
        maxValueIndicator = arrowCircle.append('g')
          .attr('transform', 'rotate(-90)');

        maxValueIndicator.append('g')
          .attr('transform', 'translate(0, ' +(ringInset - canvasRadius  - minMaxArrowOffset)+ ')')
          .append('path')
            .attr("d", utils.generateTriangle((minMaxArrowWidth), (minMaxArrowHeight)))
            .attr('transform', 'rotate(180)')
            .attr("fill", 'black');

        gauge.updateElement('pointer', undefined);
        gauge.updateElement('minValueIndicator', undefined);
        gauge.updateElement('maxValueIndicator', undefined);
      };

      gauge.updateElement = function(elemName, newValue) {
        var elem;

        if (elemName === 'pointer') {
          elem = pointer;
        }
        else if (elemName === 'minValueIndicator') {
          elem = minValueIndicator;
        }
        else if (elemName === 'maxValueIndicator') {
          elem = maxValueIndicator;
        }

        if (newValue !== undefined) {
          if (newValue > constants.maxSignal) {
            newValue = constants.maxSignal;
          }
          else if (newValue < constants.noSignal) {
            newValue = constants.noSignal;
          }

          elem.transition()
            .duration(gaugeUpdateInterval)
            .ease('quad')
            .attr('transform', 'rotate(' +levelDegScale(newValue)+ ')');

        } else {
          elem.transition()
            .duration(gaugeUpdateInterval)
            .ease('quad')
            .attr('transform', 'rotate(-90)');
        }
      };

      return gauge;
    })();

    function updateList() {
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

    function updateGauge() {
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
              $scope.level = undefined;
            }

            gauge.updateElement('pointer', $scope.level);
            gauge.updateElement('minValueIndicator', $scope.minLevel);
            gauge.updateElement('maxValueIndicator', $scope.maxLevel);
          });
        });
      }
    };

    function init() {
      gauge.render();

      function firstUpdate() {
        updateList();
        document.removeEventListener(events.swipeDone, firstUpdate);
      }

      if (globalSettings.updatesPaused()) {
        document.addEventListener(events.swipeDone, firstUpdate);
      } else {
        updateList();
      }

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
