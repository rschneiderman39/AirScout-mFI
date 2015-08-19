"use strict";

if (typeof setup === 'undefined') { var setup = {}; }

setup.language = function() {
  var progress = $.Deferred();

  navigator.globalization.getPreferredLanguage(
    function success(lang) {
      var langCode = lang.value.split('-')[0];
      globals.strings = languages[langCode] || languages[defaults.language];
      progress.resolve();
    }, function failure() {
      globals.strings = languages[defaults.language];
      progress.resolve();
    });

  return progress;
};

setup.region = function() {
  var progress = $.Deferred();

  navigator.globalization.getLocaleName(
    function success(locale) {
      var regionCode = locale.value.split('-')[1];
      globals.region = channels[regionCode] ? regionCode : defaults.region;
      progress.resolve();
    },
    function failure() {
      globals.region = defaults.region;
      progress.resolve();
    }
  );

  return progress;
};
