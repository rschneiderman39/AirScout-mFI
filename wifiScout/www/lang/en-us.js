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
    },
    tours : {
    	previousText: 'Previous', 
      nextText: 'Next',
      finishText: 'Finish'
    	channelTable : {
    		step1: 'The channel table view displays the number of access points of' 
    			+ 'each channel in the 2.4Ghz and 5.0Ghz freqency ranges.',
    		step2: 'This represents the 2.4Ghz frequency range. The 2.4Ghz frequency'
        	+ ' has a greater range than a 5.0Ghz channel.',
        step3: 'This represents the 5.0Ghz frequency range. The 5.0Ghz range allows for'
        	+ ' 23 nonoverlapping channels while the 2.4Ghz range can only support 3.'
        	+ ' Therefore, the 5.0Ghz frequency can support a larger number of devices'
        	+ ' with less interference than the 2.4Ghz frequency.'
    	},
    	apTable : {
    		step1: 'More commonly referred to as signal strength, the signal level of'
        	+ ' an access point is measured in dBm (decibel milliwatts). dBm is measured'
        	+ ' on a logarithmic scale which means that every increase of about 3dBm is'
        	+ ' equivalent to doubling the actual power of the signal in question. The'
        	+ ' signal strength is expressed as a negative number because wireless networks'
        	+ ' are not powerful enough to radiate enough energy to give out such a strong'
        	+ ' signal. A signal strength can theoretically become positive if the amount of'
        	+ ' emitted energy being collected at any point in time exceeds one milliwatt.',
        step2: '***NEEDS TO BE FILLED IN***',
        step3: 'Wireless networks have three different security options: WEP, WPA,'
        	+ ' and WPA2. WEP is the oldest security option and is considerably outdated - '
        	+ ' it should only be used when no other option is available. WPA is a certification'
        	+ ' that includes one protocol - TKIP. WPA2 is also a certification but it includes two'
        	+ ' security protocols - TKIP and CCMP. WPA2-CCMP is considered to be the most secure'
        	+ ' protocol available and should be chosed whenever it is available.',
        step4: 'The filter button allows you to search for, select, or elimate certain'
        	+ ' access points that are displayed on the table.'
    	},
    	timeGraph : {
    		step1: 'This interactive graph displays the observed signal strength of'
        	+ ' each access point over time and is updated every half second.',
    		step2: 'The filter button allows you to search for, select, or elimate certain'
        	+ ' access points that are displayed on the graph.',
    	},
    	signalStrength : {
    		step1: 'This page provides a live signal strength reading for a selected'
        	+ ' access point - it includes a maximum, minimum, and current reading'
        	+ ' for any in range AP during the time the page is open.',
        step2: 'This box holds the weakest observed signal strength for the'
        	+ ' selected access point.',
        step3: 'This box holds the strongest observed signal strength for the'
        	+ ' selected access point.',
    	},
    	channelGraph : {
    		step1: 'The channel graph view displays a parabolic depection of the channel'
      		+ ' each access point lies on and its overlap onto neighboring channels.',
    		step2:'This represents the 2.4Ghz frequency range. The 2.4Ghz frequency'
        	+ ' has a greater range than a 5.0Ghz channel.',
    		step3: 'This represents the 5.0Ghz frequency range. The 5.0Ghz range allows for'
        	+ ' 23 nonoverlapping channels while the 2.4Ghz range can only support 3.'
        	+ ' Therefore, the 5.0Ghz frequency can support a larger number of devices'
        	+ ' with less interference than the 2.4Ghz frequency.',

    	}
    }
  }
})();

var strings = window.lang[window.globalization.getPreferredLanguage()];

$scope.strings = strings;

{{strings.table.title}}
