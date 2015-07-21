var topBarHeight = $('#top-bar').height();
var optionsHeight = $('#accordion').height();

$('.panel-group').css('top', topBarHeight);
$('.panel-group').css('width', document.deviceWidth);
$('.panel-group').css('max-height', document.deviceHeight-topBarHeight);

$('#touchLayer').css('height', document.deviceHeight);