if (typeof globals === 'undefined') {
  globals = {};
}

if (typeof setup === 'undefined') {
  setup = {};
}

setup.strings = function() {
  navigator.globalization.getPreferredLanguage(function(lang) {
    strings = languages[lang.value] || languages[defaults.lang];
    setup.tours();
  });
};
