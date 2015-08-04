if (typeof languages === 'undefined') {
  languages = {};
}

languages['en'] = {
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
    sortChannel: 'Channel',
    sortLevel: 'Level (dBm)',
    sortCapabilities: 'Capabilities',
    tour: {
      intro: "More commonly referred to as signal strenght, the level of an access"
      + " point is measured in decibel milliwatts (dBm). dBm is recorded on a logarithmic"
      + " scale - every increase of ~3dBm is equivalent to doubling the power of the signal.",

      channel: "*****NEEDS TO BE FILLED IN*****",

      capabilities: "Wireless networks have three different security options: WEP, WPA,"
          + " and WPA2. WEP is the oldest security option and is considerably outdated - "
          + " it should only be used when no other option is available. WPA is a certification"
          + " that includes one protocol - TKIP. WPA2 is also a certification but it includes two"
          + " security protocols - TKIP and CCMP. WPA2-CCMP is considered to be the most secure"
          + " protocol available and should be chosed whenever it is available.",

      level: "Signal strength is expressed as a negative number because wireless networks" 
          + " are not powerful enough to radiate enough energy to give out a strong enough"
          + " signal - theoretically a positive level could be recorded if the amount of"
          + " energy emitted and received exceeds one milliwatt.",

      filter: "The filter button allows you to search for, select, or elimate certain"
          + " access points that are displayed on the table."
    }
  },
  channelTable : {
    label2_4: '2.4 Ghz',
    label5: '5 Ghz',
    labelX: 'Channel',
    labelY: 'AP Count',
    tour: {
      intro: "The channel table view displays the number of access points on"
          + " each channel in the 2.4Ghz and 5.0Ghz freqency ranges.",

      band2_4: "This represents the 2.4Ghz frequency range. The 2.4Ghz frequency"
          + " has a greater range than a 5.0Ghz channel.",

      band5: "This represents the 5.0Ghz frequency range. The 5.0Ghz range allows for"
          + " 23 nonoverlapping channels while the 2.4Ghz range can only support 3."
          + " Therefore, the 5.0Ghz frequency can support a larger number of devices"
          + " with less interference than the 2.4Ghz frequency."
    }
  },
  channelGraph : {
    label2_4: '2.4 Ghz',
    label5: '5 Ghz',
    labelX: 'Channel',
    labelY: 'Level (dBm)',
    tour: {
      intro: "The channel table view displays the number of access points on"
          + " each channel in the 2.4Ghz and 5.0Ghz freqency ranges.",

      band2_4: "This represents the 2.4Ghz frequency range. The 2.4Ghz frequency"
          + " has a greater range than a 5.0Ghz channel.",

      band5: "This represents the 5.0Ghz frequency range. The 5.0Ghz range allows for"
          + " 23 nonoverlapping channels while the 2.4Ghz range can only support 3."
          + " Therefore, the 5.0Ghz frequency can support a larger number of devices"
          + " with less interference than the 2.4Ghz frequency."
    }
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
    globalAccessPointSelectionHeader: 'Filtering',
    globalAccessPointSelectionDescription: 'Global filtering preserves access point selections across all views, while local filtering maintains a separate selection for each view.',
    globalAccessPointSelectionTrue: 'Global',
    globalAccessPointSelectionFalse: 'Local',
    detectHiddenHeader: 'Hidden Access Points',
    detectHiddenDescription: 'Detect or ignore hidden access points.',
    detectHiddenTrue: 'Detect',
    detectHiddenFalse: 'Ignore',
  },
  signalStrength: {
    listHeader: 'Select an AP to view its signal strength',
    minLevel: 'Min Level',
    currentLevel: 'Current',
    maxLevel: 'Max Level',
    tour: {
      intro: "This page provides a live signal strength reading for a selected"
          + " access point - it includes a maximum, minimum, and current reading"
          + " for any in range AP during the time the page is open.",

      minLevel: "This box holds the weakest observed signal strength for the"
          + " selected access point.",

      maxLevel: "This box holds the strongest observed signal strength for the"
          + " selected access point."
    }
  },
  timeGraph: {
    legendHeader: 'Select an AP to highlight it',
    axisLabel: 'Level (dBm)',
    tour: {
      intro: "This interactive graph displays the observed signal strength of"
          + " each access point over time and is updated every half second.",

      filter: "The filter button allows you to search for, select, or elimate certain"
          + " access points that are displayed on the graph.",
    }
  }
};
