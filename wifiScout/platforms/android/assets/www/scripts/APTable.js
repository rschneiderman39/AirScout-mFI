// Set table height and nav bar interaction layer to be height of
//	the viewport minus the height of the top bar
$('.table-striped thead').css('height', '40px');
var tHeadHeight = $('.table-striped thead').height();

$('.table-striped thead').css('top', document.topBarHeight);
$('.table-striped tbody').css('top', document.topBarHeight + tHeadHeight);

$('.table-striped tbody').css('height', (document.deviceHeight - document.topBarHeight - tHeadHeight - 10) );
