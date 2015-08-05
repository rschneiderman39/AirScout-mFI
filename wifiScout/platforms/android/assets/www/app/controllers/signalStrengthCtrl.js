app.controller('signalStrengthCtrl', ['$scope', 'globalSettings', 'accessPoints',
'setupService', function($scope, globalSettings, accessPoints, setupService) {

  setupService.ready.then(function() {

    var prefs = {
      gaugeSizeFactor: .84,
      updateInterval: 1000,
      transitionInterval: 900
    };

    $scope.strings = strings;

    $scope.APData = [];
    $scope.isDuplicateSSID = {};
    $scope.level = constants.noSignal;
    $scope.minLevel = constants.noSignal;
    $scope.maxLevel = constants.noSignal;

    $scope.isSelected = function(ap) {
      if (typeof ap.BSSID !== 'undefined') {
        return ap.BSSID === selectedBSSID;
      }
    };

    $scope.setSelected = function(ap) {
      if (typeof ap.BSSID !== 'undefined') {
        selectedBSSID = ap.BSSID;
      }
      $scope.level = undefined;
      $scope.minLevel = undefined;
      $scope.maxLevel = undefined;
    };

    $scope.sortSSID = utils.customSSIDSort;

    var selectedBSSID = "",
        gauge = undefined;

    var updateDuplicateSSIDs = function() {
      var found = {},
          newDuplicates = {};
      for (var i = 0; i < $scope.APData.length; ++i) {
        if (found[$scope.APData[i].SSID]) {
          newDuplicates[$scope.APData[i].SSID] = true;
        } else {
          found[$scope.APData[i].SSID] = true;
        }
      }
      $scope.isDuplicateSSID = newDuplicates;
    };

    var updateLevels = function() {
      var selectedAP = accessPoints.get(selectedBSSID);
      if (selectedAP !== null) {
        $scope.level = selectedAP.level;
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
        $scope.minLevel = constants.noSignal;
      }
      gauge.update('pointer', $scope.level);
      gauge.update('minValue', $scope.minLevel);
      gauge.update('maxValue', $scope.maxLevel);
    };

    var updateList = function() {
      $scope.APData = accessPoints.getAll();
    };

    var update = function() {
      if (! globalSettings.updatesPaused()) {
        $scope.$apply(function() {
          updateList();
          updateLevels();
          updateDuplicateSSIDs();
        });
      }
    };

    var prepView = function() {
      //$('#chartdiv').css('height', dimensions.window.height * 0.70);
    };

    var init = function() {
      prepView();
      initGauge();

      var updateLoop = setInterval(update, prefs.updateInterval);

      $scope.$on('$destroy', function() {
        clearInterval(updateLoop);
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
          .attr('d', utils.getCenteredTriangle(config.pointerCenterRadius, r - config.ringInset - config.ringWidth));

        minValue = center.append('g')
          .attr('transform', 'rotate(' +degScale(constants.noSignal)+ ')');

        minValue.append('g')
          .attr('transform', 'translate(0, ' +(config.ringInset - r)+ ')')
          .append('path')
            .attr("d", utils.getCenteredTriangle(config.arrowWidth, config.arrowHeight))
            .attr('transform', 'rotate(180)')
            .attr("fill", "#000");

        maxValue = center.append('g')
          .attr('transform', 'rotate(' +degScale(constants.noSignal)+ ')');

        maxValue.append('g')
          .attr('transform', 'translate(0, ' +(config.ringInset - r)+ ')')
          .append('path')
            .attr("d", utils.getCenteredTriangle(config.arrowWidth, config.arrowHeight))
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
      			.duration(config.transitionMs)
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

    		transitionMs: prefs.transitionInterval
    	});
    	gauge.render();
    };

    init();
  });

}]);