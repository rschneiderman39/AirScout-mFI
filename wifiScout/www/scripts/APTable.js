// Set table height and nav bar interaction layer to be height of 
//	the viewport minus the height of the top bar
var topBarHeight = $('#top-bar').height();
var theadHeight = $('.table-striped thead').height();

$('.table-striped thead').css('top', topBarHeight);
$('.table-striped tbody').css('top', topBarHeight + theadHeight);

$('.table-striped tbody').css('height', (document.deviceHeight - topBarHeight - theadHeight) );

$('.table-striped thead').css('width', document.deviceWidth);
$('.table-striped tbody').css('width', document.deviceWidth);

$('#touchLayer').css('height', document.deviceHeight - topBarHeight);