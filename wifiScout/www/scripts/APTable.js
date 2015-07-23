// Set table height and nav bar interaction layer to be height of
//	the viewport minus the height of the top bar
var tHeadHeight = $('.table-striped thead').height();

$('.table-striped thead').css('top', document.topBarHeight);
$('.table-striped tbody').css('top', document.topBarHeight + tHeadHeight);

$('.table-striped tbody').css('height', (document.deviceHeight - document.topBarHeight - tHeadHeight) );

$('.table-striped thead').css('width', document.deviceWidth);
$('.table-striped tbody').css('width', document.deviceWidth);

$('#touchLayer').css('height', document.deviceHeight - document.topBarHeight);
