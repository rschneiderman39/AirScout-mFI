app.controller('signalStrengthCtrl', ['$scope', '$timeout', 'globalSettings', 'accessPoints',
'setupService', function($scope, $timeout, globalSettings, accessPoints, setupService) {
  setupService.ready.then(function() {
<<<<<<< HEAD
    /*$scope.strings = strings;

    $scope.APData = [];
=======

    var listUpdateInterval = 5000,
        gaugeUpdateInterval = constants.updateIntervalFast;

    var prefs = {
      gaugeSizeFactor: .84,
    };

    $scope.strings = strings;
    $scope.accessPoints = [];
>>>>>>> 8b542675b5c90f9e4e2493869cbfd35ac8ff6b46
    $scope.isDuplicateSSID = {};
    $scope.level = constants.noSignal;
    $scope.minLevel = constants.noSignal;
    $scope.maxLevel = constants.noSignal;
    $scope.sortSSID = utils.customSSIDSort;

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

<<<<<<< HEAD
    var selectedBSSID = "",
=======
    $scope.sortSSID = utils.customSSIDSort;

    var selectedMAC = "",
>>>>>>> 8b542675b5c90f9e4e2493869cbfd35ac8ff6b46
        gauge = undefined;

    var updateList = function() {
      console.log('updating list');

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
    };*/

    var makeGauge = function() {
      var vis = d3.select("#test").append("svg");

      var outerInnerRatio = (175/150);
      var innerRadius = 150;

      var arcHeights = "400";
      var arcWidths = "400";
      var arcTransform = "translate(200,200)";

      var pi = Math.PI;
      var degreesToRads = (pi/180);
      var noSignalStart = -90 * degreesToRads; //converting from degs to radians
      var noSignalEnd = -84 * degreesToRads;
      var badSignalStart = -84 * degreesToRads;
      var badSignalEnd = -45 * degreesToRads;
      var okSignalStart = -45 * degreesToRads;
      var okSignalEnd = 15 * degreesToRads;
      var goodSignalStart = 15 * degreesToRads;
      var goodSignalEnd = 90 * degreesToRads;

      var noSignalFill = "#d3d3d3";
      var badSignalFill = "#cc4748";
      var okSignalFill = "#fdd400";
      var goodSignalFill = "#84b761";

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
        .attr("transform", "translate(0, -190)")
        .append('path')
        .attr("d", utils.generateTriangle(12,12))
        .attr('transform', 'rotate(180)')
        .attr("fill", "#000");

      // Draw maximum indicator triangle
      maxValue = center.append('g')
        .attr('transform', 'rotate(-90)');

      maxValue.append('g')
        .attr('transform', 'translate(0, -190)')
        .append('path')
          .attr("d", utils.generateTriangle(12,12))
          .attr('transform', 'rotate(180)')
          .attr("fill", "#000");
    };

<<<<<<< HEAD
    makeGauge();
=======
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

            gauge.update('pointer', $scope.level);
            gauge.update('minValue', $scope.minLevel);
            gauge.update('maxValue', $scope.maxLevel);
          });
        });
      }
    };

    var init = function() {
      initGauge();

      var firstUpdate = function() {
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

    var makeGauge = function(container, configuration) {
    	var gauge = {};

      var config = {
        width: 0,

        ringInset: 0,
        ringWidth: 0,

    		minAngle: -90,
    		maxAngle: 90,

    		numSegments: 0,
        segmentColors: [],

    		labelFormat: d3.format(',g'),
    		labelInset: 0,

        arrowWidth: 0,
        arrowHeight: 0,

        pointerCenterRadius: 0,

        bottomPadding: 0
    	};

      var pointer, minValue, maxValue, r, center, arcs, scale, degScale;

    	var donut = d3.layout.pie();

    	function deg2rad(deg) {
    		return deg * Math.PI / 180;
    	}

    	function configure(configuration) {
    		var prop = undefined;
    		for ( prop in configuration ) {
    			config[prop] = configuration[prop];
    	  }

    		range = config.maxAngle - config.minAngle;
    		r = config.width / 2;

    		// a linear scale that maps domain values to a percent from 0..1
    		scale = d3.scale.linear()
          .domain([config.minValue, config.maxValue])
    			.range([0,1]);

        degScale = d3.scale.linear()
          .domain([config.minValue, config.maxValue])
          .range([config.minAngle, config.maxAngle]);

    		ticks = scale.ticks(config.numSegments);
    		tickData = d3.range(config.numSegments).map(function() {return 1/config.numSegments;});

    		arc = d3.svg.arc()
    			.innerRadius(r - config.ringWidth - config.ringInset)
    			.outerRadius(r - config.ringInset)
    			.startAngle(function(d, i) {
    				var ratio = d * i;
    				return deg2rad(config.minAngle + (ratio * range));
    			})
    			.endAngle(function(d, i) {
    				var ratio = d * (i+1);
    				return deg2rad(config.minAngle + (ratio * range));
    			});
    	}
    	gauge.configure = configure;

    	function isRendered() {
    		return (svg !== undefined);
    	}
    	gauge.isRendered = isRendered;

    	function render(newValue) {
    		svg = d3.select(container)
    			.append('svg:svg')
    				.attr('class', 'gauge')
    				.attr('width', config.width)
    				.attr('height', r + config.bottomPadding);

        center = svg.append('g')
          .attr('transform', 'translate('+r +','+ r +')');

        center.append('circle')
          .attr('fill', 'black')
          .attr('r', config.pointerCenterRadius);

    		arcs = center.append('g')
    				.attr('class', 'arc')

      var colorScale = d3.scale.ordinal()
        .domain((function() {
          var domain = [];
          for (var i = 0; i < config.numSegments; ++i) {
            domain.push(i);
          }
          return domain;
        })())
        .range(config.segmentColors);


    		arcs.selectAll('path')
    				.data(tickData)
    			.enter().append('path')
    				.attr('fill', function (d, i) {
              return colorScale(i)

    				})
    				.attr('d', arc);

    		var lg = center.append('g')
    				.attr('class', 'label');

    		lg.selectAll('text')
    				.data(ticks)
    			.enter().append('text')
    				.text(config.labelFormat)
            .attr('transform', function(d) {
              return 'rotate(' +degScale(d) +') translate(-' +(this.getBBox().width / 2)+ ',' +(config.labelInset - r)+ ')';
            });

        pointer = center.append('g')
          .attr('transform', 'rotate(' +degScale(constants.noSignal)+ ')');

        pointer.append('path')
          .attr('stroke', 'black')
          .attr('stroke-width', 2)
          .attr('d', utils.generateTriangle(config.pointerCenterRadius, r - config.ringInset - config.ringWidth));

        minValue = center.append('g')
          .attr('transform', 'rotate(' +degScale(constants.noSignal)+ ')');

        minValue.append('g')
          .attr('transform', 'translate(0, ' +(config.ringInset - r)+ ')')
          .append('path')
            .attr("d", utils.generateTriangle(config.arrowWidth, config.arrowHeight))
            .attr('transform', 'rotate(180)')
            .attr("fill", "#000");

        maxValue = center.append('g')
          .attr('transform', 'rotate(' +degScale(constants.noSignal)+ ')');

        maxValue.append('g')
          .attr('transform', 'translate(0, ' +(config.ringInset - r)+ ')')
          .append('path')
            .attr("d", utils.generateTriangle(config.arrowWidth, config.arrowHeight))
            .attr('transform', 'rotate(180)')
            .attr("fill", "#000");

    		update('pointer', newValue === undefined ? constants.noSignal : newValue);
        update('minValue', newValue === undefined ? constants.noSignal : newValue);
        update('maxValue', newValue === undefined ? constants.noSignal : newValue);
    	}
    	gauge.render = render;

    	function update(elemName, newValue) {
        if (newValue !== undefined) {

          if (newValue > constants.maxSignal) {
            newValue = constants.maxSignal;
          } else if (newValue < constants.noSignal) {
            newValue = constants.noSignal;
          }

          if (elemName === 'pointer') {
            elem = pointer;
          } else if (elemName === 'minValue') {
            elem = minValue;
          } else if (elemName === 'maxValue') {
            elem = maxValue;
          }

      		elem.transition()
      			.duration(gaugeUpdateInterval * 0.8)
      			.ease('quad')
      			.attr('transform', 'rotate(' +degScale(newValue)+ ')');
        }
    	}
    	gauge.update = update;

    	configure(configuration);

    	return gauge;
    };

    function initGauge() {

      var baseWidth = 400,
          // The width of the containing column is somehow unavailable at this point, so we have to scale on window width instead.
          ratio = ($(window).width() * 0.66 / baseWidth) * prefs.gaugeSizeFactor;

    	gauge = makeGauge('#gauge', {
    		width: baseWidth * ratio,

    		ringWidth: 20 * ratio,
        ringInset: 25 * ratio,

        arrowWidth: 10 * ratio,
        arrowHeight: 10 * ratio,

        labelInset: 15 * ratio,

        minValue: constants.noSignal,
    		maxValue: constants.maxSignal,
        numSegments: 7,
        segmentColors: ["#cc4748", "#cc4748" ,"#fdd400", "#fdd400", "#84b761" ,"#84b761", "#84b761"],

        pointerCenterRadius: 10 * ratio,

        bottomPadding: 20 * ratio,

    		transitionMs: prefs.gaugeTransitionInterval
    	});
    	gauge.render();
    };

    init();
>>>>>>> 8b542675b5c90f9e4e2493869cbfd35ac8ff6b46
  });
}]);
