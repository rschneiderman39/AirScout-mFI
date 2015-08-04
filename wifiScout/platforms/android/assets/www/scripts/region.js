if (typeof setup === 'undefined') {
  setup = {};
}

if (typeof localization === 'undefined') {
  localization = {};
}

setup.region = function() {
  navigator.globalization.getLocaleName(
    function success(locale) {
      var regionCode = locale.value.split('-')[1];
      localization.region = channels[regionCode] ? regionCode : defaults.region;
      setup.language();
    },
    function failure() {
      localization.region = defaults.region;
      setup.language();
    }
  );
};
