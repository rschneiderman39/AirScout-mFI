if (typeof app === 'undefined') {
  app = {};
}

if (app.setup === undefined) {
  app.setup = {};
}

(function() {
  "use strict";

  var onDeviceReady = function() {
    app.setup.strings();
    app.setup.tours();

    document.dispatchEvent(new Event('setupdone'));
  };

  document.addEventListener('deviceready', onDeviceReady);

})();
