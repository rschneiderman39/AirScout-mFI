"use strict";

app.controller('signalStrengthCtrl', ['$scope', 'globals', 'utils', 'globalSettings',
'accessPoints', 'setupSequence', function($scope, globals, utils, globalSettings,
accessPoints, setupSequence) {

  setupSequence.done.then(function() {

    var updateInterval = globals.updateIntervals.signalStrength;

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

    var gauge;

    init();

    function init() {
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

      var cancelHandler = $scope.$on(globals.events.transitionDone, function() {
        cancelHandler();

        configureToOrientation();

        gauge = new Gauge('#gauge');

        gauge.render();

        updateList();

        var updateLoop = setInterval(function() {
          updateList();
          updateGauge();
        }, updateInterval);

        $scope.$on(globals.events.newSelection, updateList);

        $scope.$on(globals.events.orientationChanged, renderFromScratch);

        $scope.$on('$destroy', function() {
          clearInterval(updateLoop);
        });
      });

      function renderFromScratch() {
        configureToOrientation();

        gauge.destroy();
        gauge.render();
      };

      function configureToOrientation() {
        $('#access-points .list').height($('#access-points').height()
                          - $('#access-points .selection-indicator').outerHeight(true)
                          - $('#access-points .divider').outerHeight(true)
                          - 10);
                          // arbitrary padding

        if (utils.getOrientation() === 'portrait') {
          utils.orderElements('#signal-strength-wrapper', '#readings', '#access-points');
        } else if (utils.getOrientation() === 'landscape') {
          utils.orderElements('#signal-strength-wrapper', '#access-points', '#readings');
        }
      };
    };

    function apSelection() {
      return globalSettings.accessPointSelection();
    };

    function updateList() {
      if (globals.debug) console.log('updating signal strength list');

      accessPoints.getAll().then(function(results) {
        $scope.$apply(function() {
          var encountered = {},
              isDuplicateSSID = {};

          $scope.accessPoints = globalSettings.accessPointSelection()
                                  .apply(results);

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

      accessPoints.get($scope.selectedMac).then(function(result) {
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

    function Gauge(canvasSelector) {
      var width, height, canvasRadius, arcInset,
          arcInnerRadius, arcOuterRadius, minMaxArrowHeight,
          minMaxArrowWidth, minMaxArrowOffset, arrowCircleRadius,
          labelInset;

      var labelFormat = d3.format(',g');

      var numLabels = 10,
          outerInnerRatio = 7/6;

      var degScale = d3.scale.linear()
        .domain([globalSettings.visScaleMin(), globalSettings.visScaleMax()])
        .range([prefs.levelStartAngle, prefs.maxAngle]);

      var pointer, minValueIndicator, maxValueIndicator;

      function toRads(deg) {
        return deg * Math.PI / 180;
      };

      function format() {
        var baseWidth = 400,
            baseHeight = 200,
            scaleFactor;

        height = $(canvasSelector).height();
        arrowCircleRadius = 9 * (height / baseHeight);
        width = (height - arrowCircleRadius) * 2;

        if (width > $(canvasSelector).width()) {
          width = $(canvasSelector).width();
        }

        canvasRadius = width / 2;

        scaleFactor = width / baseWidth;

        arcInnerRadius = 155 * scaleFactor;
        arcOuterRadius = arcInnerRadius * outerInnerRatio;

        arcInset = canvasRadius - arcOuterRadius;
        labelInset = 15 * scaleFactor;

        minMaxArrowHeight = 10 * scaleFactor;
        minMaxArrowWidth = 10 * scaleFactor;
      };

      this.render = function() {
        format();

        // Canvas to draw all elements on
        var vis = d3.select(canvasSelector).append("svg")
          .attr("width", width)
          .attr("height", height);

        var noSignalStart = toRads(prefs.minAngle),
            noSignalEnd = toRads(prefs.levelStartAngle),
            badSignalStart = toRads(degScale(globalSettings.visScaleMin())),
            okSignalStart = toRads(degScale(prefs.okSignalThresh)),
            goodSignalStart = toRads(degScale(prefs.goodSignalThresh)),
            goodSignalEnd = toRads(degScale(globalSettings.visScaleMax()));

        var noSignalArc = d3.svg.arc()
          .innerRadius(arcInnerRadius)
          .outerRadius(arcOuterRadius)
          .startAngle(noSignalStart)
          .endAngle(badSignalStart);

        vis.append("path")
          .attr("d", noSignalArc)
          .attr("fill", prefs.noSignalFill)
          .attr("transform", "translate(" +canvasRadius +"," +canvasRadius +")");

        var badSignalArc = d3.svg.arc()
          .innerRadius(arcInnerRadius)
          .outerRadius(arcOuterRadius)
          .startAngle(badSignalStart)
          .endAngle(okSignalStart);

        vis.append("path")
          .attr("d", badSignalArc)
          .attr("fill", prefs.badSignalFill)
          .attr("transform", "translate(" +canvasRadius +"," +canvasRadius +")");

        var okSignalArc = d3.svg.arc()
          .innerRadius(arcInnerRadius)
          .outerRadius(arcOuterRadius)
          .startAngle(okSignalStart)
          .endAngle(goodSignalStart);

        vis.append("path")
          .attr("d", okSignalArc)
          .attr("fill", prefs.okSignalFill)
          .attr("transform", "translate(" +canvasRadius +"," +canvasRadius +")");

        var goodSignalArc = d3.svg.arc()
          .innerRadius(arcInnerRadius)
          .outerRadius(arcOuterRadius)
          .startAngle(goodSignalStart)
          .endAngle(goodSignalEnd);

        vis.append("path")
          .attr("d", goodSignalArc)
          .attr("fill", prefs.goodSignalFill)
          .attr("transform", "translate(" +canvasRadius +"," +canvasRadius +")");

        /* Draw pointer rotation point */
        var arrowCircle = vis.append('g')
          .attr("transform", "translate(" +canvasRadius +"," +canvasRadius +")");

        arrowCircle.append('circle')
          .attr('fill', 'black')
          .attr('r', arrowCircleRadius);

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
              return 'rotate(' +degScale(d) +') translate(0,' +(labelInset - canvasRadius)+ ')';
            });

        /* Draw pointer */
        pointer = arrowCircle.append('g')
          .attr('transform', 'rotate(' + prefs.minAngle + ')');

        pointer.append('path')
          .attr('stroke', 'black')
          .attr('stroke-width', 2)
          .attr('d', utils.generateTriangle(arrowCircleRadius, arcInnerRadius));

        /* Draw min and max hold indicators */
        minValueIndicator = arrowCircle.append('g')
          .attr("transform", "rotate(" + prefs.minAngle + ")");

        minValueIndicator.append('g')
          .attr('transform', 'translate(0, ' +(arcInset - canvasRadius)+ ')')
          .append('path')
          .attr("d", utils.generateTriangle(minMaxArrowWidth, minMaxArrowHeight))
          .attr('transform', 'rotate(180)')
          .attr("fill", 'black');

        maxValueIndicator = arrowCircle.append('g')
          .attr('transform', "rotate(" + prefs.minAngle + ")");

        maxValueIndicator.append('g')
          .attr('transform', 'translate(0, ' +(arcInset - canvasRadius)+ ')')
          .append('path')
            .attr("d", utils.generateTriangle((minMaxArrowWidth), (minMaxArrowHeight)))
            .attr('transform', 'rotate(180)')
            .attr("fill", 'black');

        /* Move pointer and hold arrows to starting position */
        this.updateElement('pointer', null);
        this.updateElement('minValueIndicator', null);
        this.updateElement('maxValueIndicator', null);
      };

      this.updateElement = function(elemName, newValue) {
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
            .duration(updateInterval)
            .ease('quad')
            .attr('transform', 'rotate(' +degScale(newValue)+ ')');

        } else {
          elem.transition()
            .duration(updateInterval)
            .ease('quad')
            .attr('transform', 'rotate(' + prefs.minAngle + ')');
        }
      };

      this.destroy = function() {
        d3.select(canvasSelector).selectAll('*').remove();
      };

      return this;
    };

  });

}]);
