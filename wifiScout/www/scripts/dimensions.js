if (typeof dimensions === 'undefined') {
  dimensions = {};
}

dimensions.window = {
  width: $(window).width(),
  height: $(window).height()
};

dimensions.topBar = {
  height: $('#top-bar').height()
};

dimensions.navBar = {
  bottom: -( $('#nav-bar').height() - 1)
};

$('#nav-bar').css('bottom',  dimensions.navBar.bottom);

$('#current-view').css('max-width', dimensions.window.width);
$('#current-view').css('height', dimensions.window.height - dimensions.topBar.height);
$('#current-view').css('top', dimensions.topBar.height);
