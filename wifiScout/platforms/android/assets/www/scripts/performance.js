var deviceHeight = $(window).height();
console.log(deviceHeight);

var speedometerW = .75 * deviceHeight;
var speedometerH = .5 * speedometerW;
console.log("Speedometer height is: " + speedometerH);
console.log("Speedometer width is: " + speedometerW);

deviceHeight = deviceHeight - 225;

$('.scrollable-list	').css('height', deviceHeight);
$('.speedometer').append("<center><canvas id='foo' height='" + speedometerH + "' width='" + speedometerW + "'></canvas></center>");