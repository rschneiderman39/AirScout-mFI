if (typeof app === 'undefined') {
  app = {};
}

(function() {
  app.format = {};

  app.format.window = {
    width: $(window).width(),
    height: $(window).height()
  };

  app.format.topBar = {
    height: $('#top-bar').height()
  };

  var navBarHeight = 1.25 * app.format.topBar.height;

  app.format.navBar = {
    height: navBarHeight,
    bottom: -( navBarHeight - 1)
  };

  $('#bottom-bar').css('height', app.format.navBar.height);
  $('#bottom-bar').css('bottom',  app.format.navBar.bottom);

  $('#current-view').css('max-width', app.format.window.width);
  $('#current-view').css('height', app.format.window.height - app.format.topBar.height);
  $('#current-view').css('top', app.format.topBar.height);
})();
