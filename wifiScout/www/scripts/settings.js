var optionsHeight = $('#accordion').height();

$('.panel-group').css('top', document.topBarHeight);
$('.panel-group').css('width', document.deviceWidth);
$('.panel-group').css('max-height', document.deviceHeight - document.topBarHeight);
