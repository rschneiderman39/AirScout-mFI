var speedometerW = .95 * document.deviceHeight;
var speedometerH = .60 * speedometerW;

var viewHeight = document.deviceHeight - 150;

$('.scrollable-list	').css('height', viewHeight);
$('.speedometer').append("<center><canvas id='foo' height='" + speedometerH + "' width='" + speedometerW + "'></canvas></center>");