if (typeof globals === 'undefined') {
  globals = {};
}

globals.format = {};

globals.format.window = {
  width: $(window).width(),
  height: $(window).height()
};

globals.format.topBar = {
  height: $('#top-bar').height()
};

globals.format.navBar = {
  bottom: -( $('#nav-bar').height() - 1)
};

$('#nav-bar').css('bottom',  globals.format.navBar.bottom);

$('#current-view').css('max-width', globals.format.window.width);
$('#current-view').css('height', globals.format.window.height - globals.format.topBar.height);
$('#current-view').css('top', globals.format.topBar.height);
