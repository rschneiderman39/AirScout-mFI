(function() {

  if (window.lang === undefined) {
    window.lang = {};
  }

  window.lang['en-us'] = {
    APTable : {
      sortSSID: 'SSID',
      sortBSSID: 'MAC Address',
      sortFrequency: 'Channel',
      sortLevel: 'Level (dBm)',
      sortCapabilities: 'Capabilities',
    },
    channelTable : {},
    channelGraph : {},
    filterModal : {
    	title: 'Filtering Options',
    	searchBar: 'Search by MAC address or SSID:',
    	selectAll: 'Select All',
    	deselectAll: 'Deselect All'
    }
  }
})();

var strings = window.lang[window.globalization.getPreferredLanguage()];

$scope.strings = strings;

{{strings.table.title}}
