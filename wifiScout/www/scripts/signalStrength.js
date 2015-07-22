var gaugeWidth = document.deviceWidth * 0.55,
    gaugeHeight = .65 * gaugeWidth,
    listHeight = document.deviceHeight - 150;

$('.scrollable-list	').css('height', listHeight);
$('#chartdiv').css('height', gaugeHeight);
$('#chartdiv').css('width', gaugeWidth);
//$('.speedometer').append("<center><canvas id='foo' height='" + speedometerH + "' width='" + speedometerW + "'></canvas></center>");

$('#touchLayer').css('height', document.deviceHeight - document.topBarHeight);
$('#currentView').css('height', document.deviceHeight - document.topBarHeight);
