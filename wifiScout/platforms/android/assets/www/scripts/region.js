if (typeof setup === 'undefined') { setup = {} }

setup.region = function() {
  var progress = $.Deferred();

  navigator.globalization.getLocaleName(
    function success(locale) {
      var regionCode = locale.value.split('-')[1];
      constants.region = channels[regionCode] ? regionCode : defaults.region;
      console.log(constants.region);
      progress.resolve();
    },
    function failure() {
      constants.region = defaults.region;
      console.log(constants.region);
      progress.resolve();
    }
  );

  return progress;
};
