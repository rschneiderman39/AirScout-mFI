"use strict";

if (typeof languages === 'undefined') {
  var languages = {};
}

languages['en'] = {
  hiddenSSID: '<hidden>',
  unknownManufacturer: '<unknown>',
  dBm: 'dBm',
  viewTitles: {
    accessPointTable: 'Access Point Table',
    channelGraph: 'Channel Graph',
    accessPointCount: 'Access Point Count',
    settings: 'Settings',
    signalStrength: 'Signal Strength',
    timeGraph: 'Time Graph'
  },
  accessPointCount : {
    label2_4: '2.4 Ghz',
    label5: '5 Ghz',
    labelX: 'Channel',
    labelY: 'AP Count',
    tour: {
      intro: "This view displays the number of access points on each"
        + " channel in the 2.4 and 5.0Ghz frequency ranges. A high number"
        + " of access points on one channel can be an indicator of"
        + " congestion.",

      band2_4: "This section represents the 2.4 Ghz frequency band. While"
        + " offering a greater range than the 5 Ghz band, the 2.4 Ghz band"
        + " only has 3 non-overlapping channels, making it more prone to"
        + " interference.",

      band5: "This section represents the 5 Ghz frequency band. It offers"
        + " 23 non-overlapping channels, although, not all of these are"
        + " available everywhere.  If a channel is greyed out,"
        + " unauthorized use may be restricted in your region. "
    }
  },
  accessPointTable : {
    sortSSID: 'SSID',
    sortMAC: 'MAC Address',
    sortManufacturer: 'Vendor',
    sortChannel: 'Channel',
    sortLevel: 'Level',
    sortCapabilities: 'Capabilities',
    tour: {
      intro: "This view displays all available information about all"
        + " access points visible to your device.",

      level: "The signal strength of an access point is measured in"
        + " decibel milliwatts (dBm). dBm is recorded on a logarithmic"
        + " scale - every increase of ~3dBm is equivalent to doubling the"
        + " power of the signal.  Because WiFi signals are relatively low"
        + " in energy, the measured dBm is typically a negative value,"
        + " with a smaller negative value representing a stronger signal.",

      sorting: "Tap on any of the table headers to sort the table by that"
        + " field.",

      channel: "An access point's channel number represents the"
        + " frequency range it's using.  Channels 1-14 belong to the 2.4"
        + " Ghz band, while channels 34-165 belong to the 5 Ghz band.",

      capabilities: "This field lists the networking and security"
        + " capabilities of a given access point. Wireless networks use"
        + " three common security protocols: WEP, WPA, and WPA2. WEP is no"
        + " longer considered secure - its use should be avoided.  WPA is"
        + " far better than WEP, but not as robust as WPA2, which should"
        + " be used whenever possible.  Another protocol supported by some"
        + " access points is WPS, which can be used to automate the setup"
        + " process. After setup, however, WPS should be disabled.",

      filter: "The filter button allows you to search for, select, or"
        + " eliminate certain access points that are displayed in the"
        + " table."
    }
  },
  timeGraph: {
    labelX: 'Time (s)',
    labelY: 'Level (dBm)',
    tour: {
      graph: "This interactive graph displays the measured signal strength"
        + " of each access point over time.",

      list: "Select an access point on the list to highlight it on the"
        + " graph.",

      filter: "The filter button allows you to search for, select, or"
        + " eliminate certain access points that are displayed in the"
        + " graph.",
    }
  },
    signalStrength: {
    selectedAPHeader: 'Selected AP:',
    minLevel: 'Min Level',
    currentLevel: 'Current',
    maxLevel: 'Max Level',
    tour: {
      intro: "This view provides a live signal strength reading for a"
        + " selected access point, as well as maximum and minimum hold"
        + " information.",

      minLevel: "This box displays the weakest measured signal strength"
        + " since the access point was selected.",

      maxLevel: "This box displays the strongest measured signal strength"
        + " since the access point was selected."
    }
  },
  channelGraph : {
    label2_4: '2.4 Ghz',
    label5: '5 Ghz',
    labelX: 'Channel',
    labelY: 'Level (dBm)',
    tour: {
      intro: "This view displays both the channel utilization and signal"
        + " strength of each access point. Due constraints imposed by"
        + " device manufacturers, this application is unable to detect"
        + " anything other than a device's primary 20 mHz wide channel -"
        + " any channels wider than 20 Mhz are not recognized as such.",

      band2_4: "This section represents the 2.4 Ghz frequency band. While"
        + " offering a greater range than the 5 Ghz band, the 2.4 Ghz band"
        + " only has 3 non-overlapping channels, making it more prone to"
        + " interference.",

      band5: "This section represents the 5 Ghz frequency band. It offers"
        + " 23 non-overlapping channels, although, not all of these are"
        + " available everywhere.  If a channel is greyed out,"
        + "  unauthorized use may be restricted or not allowed in your"
        + " region. ",

      filter: "The filter button allows you to search for, select, or"
        + " eliminate certain access points that are displayed in the"
        + " graph.",
    }
  },
  filterModal : {
  	title: 'Filtering Options',
  	searchBar: 'Search by MAC address or SSID:',
  	selectAll: 'Select All',
  	deselectAll: 'Deselect All'
  },
  settings: {
    visScaleHeader: 'Signal Level Scale',
    visScaleDescription: 'Drag the sliders to change the signal level scale.  The default scale is -100 dBm to -30 dBm.',
    detectHiddenHeader: 'Hidden Access Points',
    detectHiddenDescription: 'Detect or ignore hidden access points.',
    detectHiddenTrue: 'Detect',
    detectHiddenFalse: 'Ignore',
  }
};
