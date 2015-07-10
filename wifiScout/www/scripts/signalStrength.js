var speedometerW = .75 * document.deviceHeight;
var speedometerH = .5 * speedometerW;

var viewHeight = document.deviceHeight - 225;

$('.scrollable-list	').css('height', viewHeight);
$('.speedometer').append("<center><canvas id='foo' height='" + speedometerH + "' width='" + speedometerW + "'></canvas></center>");