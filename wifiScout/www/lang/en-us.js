if (typeof app === 'undefined') {
  app = {};
}

(function() {
  if (app.lang === undefined) {
    app.lang = {};
  }

  app.lang['en-US'] = {
    viewTitles: {
      APTable: 'AP Table',
      channelGraph: 'Channel Graph',
      channelTable: 'Channel Table',
      settings: 'Settings',
      signalStrength: 'Signal Strength',
      timeGraph: 'Time Graph'
    },
    APTable : {
      sortSSID: 'SSID',
      sortBSSID: 'MAC Address',
      sortFrequency: 'Channel',
      sortLevel: 'Level (dBm)',
      sortCapabilities: 'Capabilities',
    },
    channelTable : {
      label2_4: '2.4 Ghz',
      label5: '5 Ghz'
    },
    channelGraph : {
      label2_4: '2.4 Ghz',
      label5: '5 Ghz'
    },
    filterModal : {
    	title: 'Filtering Options',
    	searchBar: 'Search by MAC address or SSID:',
    	selectAll: 'Select All',
    	deselectAll: 'Deselect All'
    },
    settings: {
      startingViewHeader: 'Starting View',
      startingViewDescription: 'The app will default to the selected view on startup.',
      globalSelectionHeader: 'Filtering',
      globalSelectionDescription: 'Global filtering preserves access point selections across all views, while local filtering maintains a separate selection for each view.',
      globalSelectionTrue: 'Global',
      globalSelectionFalse: 'Lobal',
      detectHiddenHeader: 'Hidden Access Points',
      detectHiddenDescription: 'Detect or ignore hidden access points.',
      detectHiddenTrue: 'Detect',
      detectHiddenFalse: 'Ignore'
    },
    signalStrength: {
      listHeader: 'Select an AP to view its signal strength',
      minLevel: 'Min Level',
      currentLevel: 'Current',
      maxLevel: 'Max Level'
    },
    timeGraph: {
      legendHeader: 'Select an AP to highlight it',
      axisLabel: 'Level (dBm)'
    }
  };

})();
