var canvasHeight = $(window).height() - 120,
    canvasWidth = Math.floor($(window).width() * 0.72),
    legendHeight = $(window).height() - 120;

document.getElementById('plot').height = canvasHeight;
document.getElementById('plot').width = canvasWidth;
$('.scrollable-list	').css('height', legendHeight);
