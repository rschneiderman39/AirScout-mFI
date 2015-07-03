var deviceHeight = $(window).height();
console.log(deviceHeight);

deviceHeight = deviceHeight - 200;

var lineChartH = deviceHeight;

$('#line').css('max-height', lineChartH);