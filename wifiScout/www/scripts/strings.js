if (typeof setup === 'undefined') {
  setup = {};
}

setup.strings = function() {
  navigator.globalization.getPreferredLanguage(
    function success(lang) {
      var langCode = lang.value.split('-')[0];
      if (languages[langCode]) {
        localization.language
        strings = languages[langCode];
      }
      localization.language = locale.value;
      strings = languages[locale.value] || languages[defaults.locale];
      setup.tours();
    }, function failure() {
      localization.language = defaults.locale;
      strings = languages[defaults.locale];
      setup.tours();
    });
};
