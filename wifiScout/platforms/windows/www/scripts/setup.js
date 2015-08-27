"use strict";

(function() {
  $('#nav-bar').css('bottom',  1 - $('#nav-bar').height());

  //$('#current-view').css('width', $(window).width());
  $('#current-view').css('height', $(window).height() - $('#top-bar').height());
  $('#current-view').css('top', $('#top-bar').height());
})();

document.addEventListener('deviceready', function() {

  setup.region().done(function() {
    setup.language().done(function() {
      setup.tours();
      document.dispatchEvent(new Event(events.setupDone));
    });
  });

});