var plotHeight = $(window).height() - 120,
    plotWidth = Math.floor($(window).width() * 0.72),
    legendHeight = document.deviceHeight - 150;

$('.scrollable-list	').css('height', legendHeight);

document.getElementById('plot').height = plotHeight;
document.getElementById('plot').width = plotWidth;

$('#touchLayer').css('height', document.deviceHeight - document.topBarHeight);
