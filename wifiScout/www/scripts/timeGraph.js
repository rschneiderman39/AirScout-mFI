var plotH = $(window).height() - 120;
var plotW = Math.floor($(window).width() * 0.72);

var viewHeight = document.deviceHeight - 150;

$('.scrollable-list	').css('height', viewHeight);

document.getElementById('plot').height = plotH;
document.getElementById('plot').width = plotW;

$('#touchLayer').css('height', document.deviceHeight - document.topBarHeight);
