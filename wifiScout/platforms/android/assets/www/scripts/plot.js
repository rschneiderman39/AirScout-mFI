var deviceHeight = $(window).height();
console.log(deviceHeight);

var lineChartH = deviceHeight - 70;

$('#line').css('max-height', lineChartH);