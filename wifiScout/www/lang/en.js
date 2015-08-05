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
      intro: "This view displays all available information about the access points visible to the device.",

      channel: "An access point's channel number represents the frequency range it's using.  Channels 1-14 belong to the 2.4 Ghz band, while channels 34-165 belong to the 5 Ghz band.",

      capabilities: "The signal strength of an access point is measured in decibel milliwatts (dBm). dBm is recorded on a logarithmic scale - every increase of ~3dBm is equivalent to doubling the power of the signal.  Because WiFi signals are relatively low in energy, the measured dBm is typically a negative value, with a smaller negative value representing a stronger signal.",

      level: "The signal strength of an access point is measured in decibel milliwatts (dBm). dBm is recorded on a logarithmic scale - every increase of ~3dBm is equivalent to doubling the power of the signal.  Because WiFi signals are relatively low in energy, the measured dBm is typically a negative value, with a smaller negative value representing a stronger signal.",

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
      intro: "This view displays the number of access points on each channel in the 2.4 and 5.0Ghz frequency ranges.  A high number of access points on one channel can be an indicator of congestion.",

      band2_4: "This section represents the 2.4 Ghz frequency band.  While offering a greater range than the 5 Ghz band, the 2.4 Ghz band only has 3 non-overlapping channels, making it more prone to interference.",

      band5: "This section represents the 5 Ghz frequency band.  It offers 23 non-overlapping channels, although, not all of these are available everywhere.  If a channel is greyed out,  unauthorized use is disallowed or restricted in your region."
    }
  },
  channelGraph : {
    label2_4: '2.4 Ghz',
    label5: '5 Ghz',
    labelX: 'Channel',
    labelY: 'Level (dBm)',
    tour: {
      intro: "This view displays both the channel utilization and signal strength of each access point. Due constraints imposed by device manufacturers, this application is prevented from displaying anything other than a device's primary 20 mHz wide channel - any channels wider than 20 Mhz are not recognized as such.",

      band2_4: "This section represents the 2.4 Ghz frequency band.  While offering a greater range than the 5 Ghz band, the 2.4 Ghz band only has 3 non-overlapping channels, making it more prone to interference.",

      band5: "This section represents the 5 Ghz frequency band.  It offers 23 non-overlapping channels, although not all of these are available everywhere.  If a channel is greyed out,  unauthorized use is disallowed or restricted in your region."
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
    legendHeader: 'Select an AP to highlight it:',
    axisLabel: 'Level (dBm)',
    tour: {
      intro: "This interactive graph displays the observed signal strength of"
          + " each access point over time and is updated every half second.",

      list: "Select an access point on the list to highlight it on the graph.",

      filter: "The filter button allows you to search for, select, or elimate certain"
          + " access points that are displayed on the graph.",
    }
  }
};
