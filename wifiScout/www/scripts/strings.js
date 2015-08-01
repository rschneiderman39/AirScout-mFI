if (typeof globals === 'undefined') {
  globals = {};
}

if (typeof globals.setup === 'undefined') {
  globals.setup = {};
}

globals.setup.strings = function() {
  navigator.globalization.getPreferredLanguage(
    function success(locale) {
      globals.locale = locale.value;
      globals.strings = globals.lang[locale.value] || globals.lang[globals.defaults.locale];
      globals.setup.tours();
    }, function failure() {
      globals.locale = globals.defaults.locale;
      globals.strings = globals.lang[globals.defaults.locale];
      globals.setup.tours();
    });
};
