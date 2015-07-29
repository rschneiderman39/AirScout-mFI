(function() {

  if (window.lang === undefined) {
    window.lang = {};
  }

  window.lang['en-us'] = {
    : {
      title: 'asdfasdfasdf',

    }
  }
})();

var strings = window.lang[window.globalization.getPreferredLanguage()];

$scope.strings = strings;

{{strings.table.title}}
