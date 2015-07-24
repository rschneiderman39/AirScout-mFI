var topBarHeight = $('#top-bar').height();
var legendTitleHeight = $('.legend-title').height();

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
