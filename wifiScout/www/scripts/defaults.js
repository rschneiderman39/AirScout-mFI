if (typeof app === 'undefined') {
  app = {};
}

(function() {
  app.defaults = {};

  app.defaults.startingView = 'settings';
  app.defaults.globalSelection = false,
  app.defaults.detectHidden = false;
  app.defaults.lang = 'en-US';
  app.defaults.filterableViews = ['channelGraph', 'timeGraph', 'APTable'];
})();
