"use strict";

app.controller('signalStrengthCtrl', ['$scope', 'globalSettings', 'accessPoints',
'setupService', function($scope, globalSettings, accessPoints, setupService) {

  setupService.ready.then(function() {

    var gaugeUpdateInterval = constants.updateIntervalNormal,
        listUpdateInterval = 5000;

    var prefs = {
      okSignalThresh: -80,
      goodSignalThresh: -60,
      noSignalFill: "#d3d3d3",
      badSignalFill: "#cc4748",
      okSignalFill: "#fdd400",
      goodSignalFill: "#84b761",
      minAngle: -90,
      maxAngle: 90,
      levelStartAngle: -84
    };

    $scope.accessPoints = [];
    $scope.isDuplicateSSID = {};
    $scope.level = null;
    $scope.minLevel = null;
    $scope.maxLevel = null;

    $scope.selectedSsid = null;
    $scope.selectedMac = null;

    $scope.strings = globals.strings;

    $scope.isSelected = function(ap) {
      if (typeof ap.mac !== 'undefined') {
        return ap.mac === $scope.selectedMac;
      }
    };

    $scope.setSelected = function(ap) {
      if (typeof ap.mac !== 'undefined') {
        $scope.selectedSsid = ap.ssid;
        $scope.selectedMac = ap.mac;
      }

      $scope.level = null;
      $scope.minLevel = null;
      $scope.maxLevel = null;
    };

    $scope.sortSSID = utils.customSSIDSort;

    function init() {
      if (prefs.okSignalThresh < globalSettings.visScaleMin()) {
        prefs.okSignalThresh = globalSettings.visScaleMin();
      } else if (prefs.okSignalThresh > globalSettings.visScaleMax()) {
        prefs.okSignalThresh = globalSettings.visScaleMax();
      }

      if (prefs.goodSignalThresh < globalSettings.visScaleMin()) {
        prefs.goodSignalThresh = globalSettings.visScaleMin();
      } else if (prefs.goodSignalThresh > globalSettings.visScaleMax()) {
        prefs.goodSignalThresh = globalSettings.visScaleMax();
      }

      gauge.render();

      $(document).one(events.transitionDone, updateList);

      var listUpdateLoop = setInterval(function() {
        if (! globalSettings.updatesPaused()) {
          updateList();
        }
      }, listUpdateInterval);

      var gaugeUpdateLoop = setInterval(function() {
        if (! globalSettings.updatesPaused()) {
          updateGauge();
        }
      }, gaugeUpdateInterval);

      $(document).on(events.newSelection, updateList);

      $scope.$on('$destroy', function() {
        clearInterval(listUpdateLoop);
        clearInterval(gaugeUpdateLoop);

        $(document).off(events.newSelection, updateList);
      });

    };

    function apSelection() {
      return globalSettings.accessPointSelection();
    };

    function updateList() {
      if (globals.debug) console.log('updating signal strength list');

      accessPoints.getAll().done(function(results) {
        $scope.$apply(function() {
          var encountered = {},
              isDuplicateSSID = {};

          $scope.accessPoints = apSelection().apply(results);

          $.each($scope.accessPoints, function(i, ap) {
            if (encountered[ap.ssid]) {
              isDuplicateSSID[ap.ssid] = true;
            } else {
              encountered[ap.ssid] = true;
            }
          });

          $scope.isDuplicateSSID = isDuplicateSSID;
        });
      });
    };

    function updateGauge() {
      if (globals.debug) console.log('updating signal strength gauge');

      accessPoints.get($scope.selectedMac).done(function(result) {
        $scope.$apply(function() {
          if (result !== null) {
            $scope.level = result.level;

            if ($scope.minLevel === null) {
              $scope.minLevel = $scope.level;
            } else if ($scope.level < $scope.minLevel) {
              $scope.minLevel = $scope.level;
            }

            if ($scope.maxLevel === null) {
              $scope.maxLevel = $scope.level;
            } else if ($scope.level > $scope.maxLevel) {
              $scope.maxLevel = $scope.level;
            }
          } else {
            $scope.level = null;
          }

          gauge.updateElement('pointer', $scope.level);
          gauge.updateElement('minValueIndicator', $scope.minLevel);
          gauge.updateElement('maxValueIndicator', $scope.maxLevel);
        });
      });
    };

    function toRads(deg) {
      return deg * Math.PI / 180;
    };

    var gauge = (function() {
      var gauge = {};

      // Scale speedometer to device size
      // Initial SVG canvas sizing
      var baseWidth = 400;

      var width = $(window).width() * .6;
      var height = $(window).height() * .6;

      var scaleFactor = width / baseWidth;

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

      var arrowCircleSize = 9 * scaleFactor;

      var labelFormat = d3.format(',g');
      var labelInset = 15 * scaleFactor;
      var numLabels = 10;

      var degScale = d3.scale.linear()
        .domain([globalSettings.visScaleMin(), globalSettings.visScaleMax()])
        .range([prefs.levelStartAngle, prefs.maxAngle]);

      var pointer, minValueIndicator, maxValueIndicator;

      gauge.render = function() {
        // Canvas to draw all elements on
        var vis = d3.select("#gauge").append("svg")
          .attr("width", width)
          .attr("height", height);

        var noSignalStart = toRads(prefs.minAngle),
            noSignalEnd = toRads(prefs.levelStartAngle),
            badSignalStart = toRads(degScale(globalSettings.visScaleMin())),
            okSignalStart = toRads(degScale(prefs.okSignalThresh)),
            goodSignalStart = toRads(degScale(prefs.goodSignalThresh)),
            goodSignalEnd = toRads(degScale(globalSettings.visScaleMax()));

        var noSignalArc = d3.svg.arc()
          .innerRadius(innerRadius)
          .outerRadius(innerRadius * outerInnerRatio)
          .startAngle(noSignalStart)
          .endAngle(badSignalStart);

        vis.append("path")
          .attr("d", noSignalArc)
          .attr("fill", prefs.noSignalFill)
          .attr("transform", "translate(" +arcTransform +"," +arcTransform +")");

        var badSignalArc = d3.svg.arc()
          .innerRadius(innerRadius)
          .outerRadius(innerRadius * outerInnerRatio)
          .startAngle(badSignalStart)
          .endAngle(okSignalStart);

        vis.append("path")
          .attr("d", badSignalArc)
          .attr("fill", prefs.badSignalFill)
          .attr("transform", "translate(" +arcTransform +"," +arcTransform +")");

        var okSignalArc = d3.svg.arc()
          .innerRadius(innerRadius)
          .outerRadius(innerRadius * outerInnerRatio)
          .startAngle(okSignalStart)
          .endAngle(goodSignalStart);

        vis.append("path")
          .attr("d", okSignalArc)
          .attr("fill", prefs.okSignalFill)
          .attr("transform", "translate(" +arcTransform +"," +arcTransform +")");

        var goodSignalArc = d3.svg.arc()
          .innerRadius(innerRadius)
          .outerRadius(innerRadius * outerInnerRatio)
          .startAngle(goodSignalStart)
          .endAngle(goodSignalEnd);

        vis.append("path")
          .attr("d", goodSignalArc)
          .attr("fill", prefs.goodSignalFill)
          .attr("transform", "translate(" +arcTransform +"," +arcTransform +")");

        /* Draw pointer rotation point */
        var arrowCircle = vis.append('g')
          .attr("transform", "translate(" +arcTransform +"," +arcTransform +")");

        arrowCircle.append('circle')
          .attr('fill', 'black')
          .attr('r', arrowCircleSize);

        /* Draw level labels */
        var labelScale = d3.scale.linear()
          .domain([globalSettings.visScaleMin(), globalSettings.visScaleMax()])
          .range([0,1])

        var ticks = labelScale.ticks(numLabels);

        var arcLabels = arrowCircle.append('g')
              .attr('class', 'label');

        arcLabels.selectAll('text')
          .data(ticks)
          .enter().append('text')
            .text(labelFormat)
            .attr('transform', function(d) {
              return 'rotate(' +degScale(d) +') translate(0,' +(labelInset - arcRadius)+ ')';
            });

        /* Draw pointer */
        pointer = arrowCircle.append('g')
          .attr('transform', 'rotate(' + prefs.minAngle + ')');

        pointer.append('path')
          .attr('stroke', 'black')
          .attr('stroke-width', 2)
          .attr('d', utils.generateTriangle(arrowCircleSize, (canvasRadius - ringInset - ringWidth)));

        /* Draw min and max hold indicators */
        minValueIndicator = arrowCircle.append('g')
          .attr("transform", "rotate(" + prefs.minAngle + ")");

        minValueIndicator.append('g')
          .attr('transform', 'translate(0, ' +(ringInset - canvasRadius  - minMaxArrowOffset)+ ')')
          .append('path')
          .attr("d", utils.generateTriangle(minMaxArrowWidth, minMaxArrowHeight))
          .attr('transform', 'rotate(180)')
          .attr("fill", 'black');

        maxValueIndicator = arrowCircle.append('g')
          .attr('transform', "rotate(" + prefs.minAngle + ")");

        maxValueIndicator.append('g')
          .attr('transform', 'translate(0, ' +(ringInset - canvasRadius  - minMaxArrowOffset)+ ')')
          .append('path')
            .attr("d", utils.generateTriangle((minMaxArrowWidth), (minMaxArrowHeight)))
            .attr('transform', 'rotate(180)')
            .attr("fill", 'black');

        /* Move pointer and hold arrows to starting position */
        gauge.updateElement('pointer', null);
        gauge.updateElement('minValueIndicator', null);
        gauge.updateElement('maxValueIndicator', null);
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

        elem.interrupt();

        if (newValue !== null) {
          if (newValue > globalSettings.visScaleMax()) {
            newValue = globalSettings.visScaleMax();
          }
          else if (newValue < globalSettings.visScaleMin()) {
            newValue = globalSettings.visScaleMin();
          }

          elem.transition()
            .duration(gaugeUpdateInterval)
            .ease('quad')
            .attr('transform', 'rotate(' +degScale(newValue)+ ')');

        } else {
          elem.transition()
            .duration(gaugeUpdateInterval)
            .ease('quad')
            .attr('transform', 'rotate(' + prefs.minAngle + ')');
        }
      };

      return gauge;

    })();

    init();

  });

}]);
