var gauge = function(container, configuration) {
	var that = {};
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
  
	var donut = d3.layout.pie();
	
	function deg2rad(deg) {
		return deg * Math.PI / 180;
	}
	
	function newAngle(d) {
		var ratio = scale(d);
		var newAngle = config.minAngle + (ratio * range);
		return newAngle;
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
	that.configure = configure;
	
	function centerTranslation() {
		return 'translate('+r +','+ r +')';
	}
	
	function isRendered() {
		return (svg !== undefined);
	}
	that.isRendered = isRendered;
	
	function render(newValue) {
		svg = d3.select(container)
			.append('svg:svg')
				.attr('class', 'gauge')
				.attr('width', config.clipWidth)
				.attr('height', config.clipHeight);
		
		var centerTx = centerTranslation();
		
		var arcs = svg.append('g')
				.attr('class', 'arc')
				.attr('transform', centerTx);
    
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
		
		var lg = svg.append('g')
				.attr('class', 'label')
				.attr('transform', centerTx);
		lg.selectAll('text')
				.data(ticks)
			.enter().append('text')
				.attr('transform', function(d) {
					var ratio = scale(d);
          var newAngle = config.minAngle + (ratio * range);
					return 'rotate(' +newAngle +') translate(0,' +(config.labelInset - r) +')';
				})
				.text(config.labelFormat);

		var lineData = [ [config.pointerWidth / 2, 0], 
						[0, -pointerHeadLength],
						[-(config.pointerWidth / 2), 0],
						[0, config.pointerTailLength],
						[config.pointerWidth / 2, 0] ];
		var pointerLine = d3.svg.line().interpolate('basis');
    
    var minValue = svg.append('g') 
      .attr("id", "arrowhead")
      .attr('transform', centerTx)
      .append("svg:path")
      .attr("d","M 0 0 L 10 0 L 5 10 z") 
      .attr("fill", "#000")
      .attr('transform', function() {
        var ratio = scale(-90);
        var newAngle = config.arrowMinAngle + (ratio * (config.arrowMaxAngle-config.arrowMinAngle));
        return 'rotate(' +newAngle +') translate(0,' + (config.arrowInset - r) +')';
      }); 
    
    var maxValue = svg.append('g') 
      .attr("id", "arrowhead")
      .attr('transform', centerTx)
      .append("svg:path")
      .attr("d","M 0 0 L 10 0 L 5 10 z") 
      .attr("fill", "#000")
      .attr('transform', function() {
        var ratio = scale(-70);
        var newAngle = config.arrowMinAngle + (ratio * (config.arrowMaxAngle-config.arrowMinAngle));
        return 'rotate(' +newAngle +') translate(0,' + (config.arrowInset - r) +')';
      });
    
  function testingUpdate(newValue) {
    minValue.transition()
      .duration(3000)
			.attr('transform', function() {
        var ratio = scale(newValue);
        var newAngle = config.arrowMinAngle + (ratio * (config.arrowMaxAngle-config.arrowMinAngle));
        return 'rotate(' +newAngle +') translate(0,' + (config.arrowInset - r) +')';
        });
  }
    
    testingUpdate(-80);
    
		var pg = svg.append('g').data([lineData])
				.attr('class', 'pointer')
				.attr('transform', centerTx);
    var test = svg.append("marker")
      .attr("markerWidth", 6)
      .attr("markerHeight", 4)
      .attr("orient", "auto")
				
		pointer = pg.append('path')
			.attr('d', pointerLine)
			.attr('transform', 'rotate(' +config.minAngle +')');
			
		update(newValue === undefined ? 0 : newValue);
	}
	that.render = render;
	
	function update(newValue, newConfiguration) {
		if ( newConfiguration  !== undefined) {
			configure(newConfiguration);
		}
		var ratio = scale(newValue);
		var newAngle = config.minAngle + (ratio * range);
		pointer.transition()
			.duration(config.transitionMs)
			.ease('elastic')
			.attr('transform', 'rotate(' +newAngle +')');
	}
	that.update = update;

	configure(configuration);
	
	return that;
};

function onDocumentReady() {
	var powerGauge = gauge('#power-gauge', {
		size: 400,
		clipWidth: 400,
		clipHeight: 400,
		ringWidth: 40,
    minValue: -100,
		maxValue: -30,
		transitionMs: 4000,
	});
	powerGauge.render();
	
	function updateReadings() {
		// just pump in random data here...
		powerGauge.update(Math.random() * 100);
	}
	
	// every few seconds update reading values
	updateReadings();
	setInterval(function() {
		updateReadings();
	}, 3 * 1000);
}

onDocumentReady();