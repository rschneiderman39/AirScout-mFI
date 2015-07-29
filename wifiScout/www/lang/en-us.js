(function() {

  if (window.lang === undefined) {
    window.lang = {};
  }

  window.lang['en-us'] = {
    titles: {
      APTable: 'AP Table',
      channelGraph: 'Channel Graph',
      channelTable: 'Channel Table',
      settings: 'Settings',
      signalStrength: 'Signal Strength',
      timeGraph: 'Time Graph'
    },
    settings: {
      starting_view_header: 'Starting View',
      starting_view_description: 'The app will default to the selected view on startup.',
      global_selection_header: 'Filtering',
      global_selection_description: 'Global filtering preserves access point selections across all views, while local filtering maintains a separate selection for each view.',
      global_selection_true: 'Global',
      global_selection_false: 'Lobal',
      detect_hidden_header: 'Hidden Access Points',
      detect_hidden_description: 'Detect or ignore hidden access points.',
      detect_hidden_true: 'Detect',
      detect_hidden_false: 'Ignore'
    },
    signalStrength: {
      list_header: 'Select an AP to view its signal strength',
      min_level: 'Min Level',
      current_level: 'Current',
      max_level: 'Max Level'
    },
    timeGraph: {
      legend_header: 'Select an AP to highlight it',
      plot_axis_label: 'Level (dBm)'
    }
  };

})();
