if (typeof app === 'undefined') {
  app = {};
}

if (typeof app.setup === 'undefined') {
  app.setup = {};
}

app.setup.strings = function() {
  navigator.globalization.getPreferredLanguage(function(lang) {
    app.strings = app.lang[lang.value] || app.lang[app.defaults.lang];
    app.setup.tours();
  });
};
