//	Dynamically scale the size of the speedometer depending on device size
var gaugeHeight = document.deviceHeight * 0.70;
//var gaugeWidth = gaugeHeight * 2.50;
$('#chartdiv').css('height', gaugeHeight);
//$('#chartdiv').css('width', gaugeWidth);