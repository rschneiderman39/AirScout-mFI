if (typeof setup === 'undefined') {
  setup = {};
}

setup.language = function() {
  navigator.globalization.getPreferredLanguage(
    function success(lang) {
      var langCode = lang.value.split('-')[0];
      strings = languages[langCode] || languages[defaults.language];
      setup.tours();
    }, function failure() {
      strings = languages[defaults.language];
      setup.tours();
    });
};
