var speedometerW = document.deviceHeight;
var speedometerH = .68 * speedometerW;

var viewHeight = document.deviceHeight - 150;

$('.scrollable-list	').css('height', viewHeight);
$('#chartdiv').css('height', speedometerH);
$('#chartdiv').css('width', speedometerW);
//$('.speedometer').append("<center><canvas id='foo' height='" + speedometerH + "' width='" + speedometerW + "'></canvas></center>");

$('#touchLayer').css('height', document.deviceHeight - document.topBarHeight);
