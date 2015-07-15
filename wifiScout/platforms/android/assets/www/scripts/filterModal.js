//Set total height of modal to be 2/3rds of the height of the device
var heightPadding = (2/3);
var modalHeight = document.deviceHeight * heightPadding;

//Set total height of scrollable list to be 2/3rds or height of device
//	also includes padding for the table header and buttons
var headerHeight = $('.modal-header').height();
var listPadding = 2 * headerHeight;

$('.modal-body').css('max-height', modalHeight);
$('#modalList').css('max-height', modalHeight+listPadding);