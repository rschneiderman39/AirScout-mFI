var topBarHeight = $('#top-bar').height();
var legendTitleHeight = $('.legend-title').height();

// Move view content down below top nav bar
//$('#legend').css('top', topBarHeight);
//$('#timeGraph').css('top', topBarHeight);

// Set width of scrollable table depending on device size
$('#legend').css('min-width', ( (.28) * document.deviceWidth ));

// Sets dimensions of time graph depending on device size
var plotHeight = document.deviceHeight * 0.70;
var plotWidth = document.deviceWidth * 0.66;
document.getElementById('plot').height = plotHeight;
document.getElementById('plot').width = plotWidth;

// Sets height of scrollable list depending on device size
var legendHeight = (document.deviceHeight-topBarHeight-legendTitleHeight) * 0.85;
$('.legendList').css('height', legendHeight);

// Sets height of nav bar interaction layer to be that of the entire view
//	minus the top nav bar
$('#touchLayer').css('height', document.deviceHeight - topBarHeight);