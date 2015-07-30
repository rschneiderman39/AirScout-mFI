if (typeof app === 'undefined') {
  app = {};
}

app.format = {};

app.format.window = {
  width: $(window).width(),
  height: $(window).height()
};

app.format.topBar = {
  height: $('#top-bar').height()
};

app.format.navBar = {
  bottom: -( $('#nav-bar').height() - 1)
};

$('#nav-bar').css('bottom',  app.format.navBar.bottom);

$('#current-view').css('max-width', app.format.window.width);
$('#current-view').css('height', app.format.window.height - app.format.topBar.height);
$('#current-view').css('top', app.format.topBar.height);
