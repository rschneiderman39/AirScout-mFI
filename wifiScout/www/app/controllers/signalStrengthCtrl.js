app.controller('signalStrengthCtrl', ['$scope', 'globalSettings', 'accessPoints',
'setupService', function($scope, globalSettings, accessPoints, setupService) {

  setupService.ready.then(function() {

    var prefs = {
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
        gauge.update('pointer', $scope.level);
        gauge.update('minValue', $scope.minLevel);
        gauge.update('maxValue', $scope.maxLevel);
      } else {
        $scope.level = constants.noSignal;
        $scope.minLevel = constants.noSignal;
        $scope.maxLevel = constants.noSignal;
      }
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
    		ringInset					: 25,

    		pointerWidth				: 10,
    		pointerTailLength			: 5,
    		pointerHeadLengthPercent	: 1.2,

        arrowMinAngle     : -94,
        arrowMaxAngle     : 90,

    		minAngle					: -90,
    		maxAngle					: 90,

    		majorTicks					: 7,
    		labelFormat					: d3.format(',g'),
    		labelInset					: 10,

        arrowInset          : 15,
    	};

      var pointer, minValue, maxValue, r, center, arcs, scale, degScale;

    	var donut = d3.layout.pie();

    	function deg2rad(deg) {
    		return deg * Math.PI / 180;
    	}

    	function getAngle(level) {
    		var ratio = scale(level);
    		var angle = config.minAngle + (ratio * range);
    		return angle;
    	}

    	function configure(configuration) {
    		var prop = undefined;
    		for ( prop in configuration ) {
    			config[prop] = configuration[prop];
    	  }

    		range = config.maxAngle - config.minAngle;
    		r = config.size / 2;
    		pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);

    		// a linear scale that maps domain values to a percent from 0..1
    		scale = d3.scale.linear()
    			.range([0,1])
    			.domain([config.minValue, config.maxValue]);

        degScale = d3.scale.linear()
          .domain([config.minValue, config.maxValue])
          .range([config.minAngle, config.maxAngle]);

    		ticks = scale.ticks(config.majorTicks);
    		tickData = d3.range(config.majorTicks).map(function() {return 1/config.majorTicks;});

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
    				.attr('width', config.clipWidth)
    				.attr('height', config.clipHeight);

        center = svg.append('g')
          .attr('transform', 'translate('+r +','+ r +')');

    		arcs = center.append('g')
    				.attr('class', 'arc')

      var colorScale = d3.scale.ordinal()
        .domain([0, 1, 2, 3, 4, 5, 6])
        .range(["#ce2029", "#ce2029" ,"#fdd400", "#fdd400", "#33a532" ,"#33a532", "#33a532"]);

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
    				.attr('transform', function(d) {
              return 'rotate(' +degScale(d) +') translate(0,' +(config.labelInset - r) +')';
            })
    				.text(config.labelFormat);

    		var lineData = [ [config.pointerWidth / 2, 0],
    						[0, -pointerHeadLength],
    						[-(config.pointerWidth / 2), 0],
    						[0, config.pointerTailLength],
    						[config.pointerWidth / 2, 0] ];
    		var pointerLine = d3.svg.line().interpolate('basis');

    		var pg = center.append('g').data([lineData])
    				.attr('class', 'pointer');

        var test = svg.append("marker")
          .attr("markerWidth", 6)
          .attr("markerHeight", 4)
          .attr("orient", "auto")

    		pointer = pg.append('path')
    			.attr('d', pointerLine)
    			.attr('transform', 'rotate(' +config.minAngle +')');

        minValue = center.append('g')
          .attr('transform', 'rotate(' +degScale(constants.noSignal)+ ')');

        minValue.append('g')
          .attr('transform', 'translate(0, ' +(config.arrowInset - r)+ ')')
          .append('path')
            .attr("d","M 0 0 L 10 0 L 5 10 z")
            .attr("fill", "#000");

        maxValue = center.append('g')
          .attr('transform', 'rotate(' +degScale(constants.noSignal)+ ')');

        maxValue.append('g')
          .attr('transform', 'translate(0, ' +(config.arrowInset - r)+ ')')
          .append('path')
            .attr("d","M 0 0 L 10 0 L 5 10 z")
            .attr("fill", "#000");

    		update('pointer', newValue === undefined ? constants.noSignal : newValue);
        update('minValue', newValue === undefined ? constants.noSignal : newValue);
        update('maxValue', newValue === undefined ? constants.noSignal : newValue);
    	}
    	gauge.render = render;

    	function update(elemName, newValue) {
        if (newValue !== undefined) {

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
    	gauge = makeGauge('#gauge', {
    		size: 400,
    		clipWidth: 400,
    		clipHeight: 400,
    		ringWidth: 40,
        pointerWidth				: 10,
    		pointerTailLength			: 0,
    		pointerHeadLengthPercent	: 1.2,
        minValue: constants.noSignal,
    		maxValue: constants.maxSignal,
    		transitionMs: prefs.transitionInterval,
    	});
    	gauge.render();
    };

    init();
  });

}]);
