if (typeof globals === 'undefined') {
  globals = {};
}

if (typeof globals.setup === 'undefined') {
  globals.setup = {};
}

globals.setup.strings = function() {
  navigator.globalization.getPreferredLanguage(function(lang) {
    globals.strings = globals.lang[lang.value] || globals.lang[globals.defaults.lang];
    globals.setup.tours();
  });
};
