"use strict";

document.addEventListener('deviceready', function() {

  setup.region().done(function() {
    setup.language().done(function() {
      setup.tours();
      document.dispatchEvent(new Event(events.setupDone));
    });
  });

});
