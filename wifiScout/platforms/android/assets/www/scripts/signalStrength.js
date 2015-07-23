// Move view content down below top nav bar
$('.selectableList').css('top', document.topBarHeight);
$('.testing').css('top', document.topBarHeight);

// Set width of scrollable table depending on device size
$('.selectableList').css('min-width', ( (.28) * document.deviceWidth ));

// Sets height of scrollable list depending on device size
var listTitleHeight = $('.list').height();
var listHeight = (document.deviceHeight-document.topBarHeight-listTitleHeight) * 0.85;
$('.list').css('height', listHeight);

// Sets height and width of speedoemter depending on device size
var gaugeWidth = document.deviceWidth * 0.65;
var gaugeHeight = .55 * gaugeWidth;
$('#chartdiv').css('height', gaugeHeight);
$('#chartdiv').css('width', gaugeWidth);
var shiftDown = ( document.deviceHeight - gaugeHeight) / 2;
$('.testing').css('top', shiftDown);

var gaugeDivHeight = $('.testing').height();
if( (document.deviceHeight - gaugeDivHeight ) > 100 ) {
	var gaugeWidth = document.deviceWidth * 0.70;
	var gaugeHeight = .60 * gaugeWidth;
	$('#chartdiv').css('height', gaugeHeight);
	$('#chartdiv').css('width', gaugeWidth);

	var listWidth = $('.selectableList').width();
	var shiftLeft = ( document.deviceWidth - gaugeWidth - listWidth ) / 2;
	$('#touchLayer').css('left', shiftLeft);
	$('.one').css('left', shiftLeft);
	$('.two').css('left', shiftLeft);
	$('.three').css('left', shiftLeft);
}

// Shift the entire view (minus the top nav bar) left so it is centered within
//	the main view
else {
	var listWidth = $('.selectableList').width();
	var shiftLeft = ( document.deviceWidth - gaugeWidth - listWidth ) / 4;
	$('#touchLayer').css('left', shiftLeft);
	$('.one').css('left', shiftLeft);
	$('.two').css('left', shiftLeft);
	$('.three').css('left', shiftLeft);
}


// Sets height of nav bar interaction layer to be that of the entire view
//	minus the top nav bar
$('#currentView').css('height', document.deviceHeight - document.topBarHeight);
