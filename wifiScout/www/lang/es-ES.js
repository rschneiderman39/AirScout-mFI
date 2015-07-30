if (typeof globals === 'undefined') {
  globals = {};
}

(function() {
  if (globals.lang === undefined) {
    globals.lang = {};
  }

  globals.lang['es-ES'] = {
    viewTitles: {
      APTable: 'Puntos de Acceso',
      channelGraph: 'Utilization de Canales',
      channelTable: 'Canales',
      settings: 'Configuracion',
      signalStrength: 'Fuerza de Senal',
      timeGraph: 'Grafico'
    },
    APTable : {
      sortSSID: 'SSID',
      sortBSSID: 'Direccion MAC',
      sortChannel: 'Canal',
      sortLevel: 'Nivel (dBm)',
      sortCapabilities: 'Capacidades',
      tour: {
        intro: "Un recorrido en espanol",

        channel: "Burritos",

        capabilities: "Enchiladas",

        filter: "Horchata"
      }
    },
    channelTable : {
      label2_4: '2,4 Ghz',
      label5: '5 Ghz',
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
      label2_4: '2,4 Ghz',
      label5: '5 Ghz',
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
    	title: 'Seleccion',
    	searchBar: 'Buscar:',
    	selectAll: 'Selectar Todo',
    	deselectAll: 'Anular Seleccion'
    },
    settings: {
      startingViewHeader: 'Vista Inicial',
      startingViewDescription: 'La vista inicial de la applicacion.',
      globalSelectionHeader: 'Seleccion',
      globalSelectionDescription: 'Global: Todas las vistas comparten un seleccion. Local: Cada vista tiene seleccion propia.',
      globalSelectionTrue: 'Global',
      globalSelectionFalse: 'Local',
      detectHiddenHeader: 'Puntos de Acceso Escondido',
      detectHiddenDescription: 'Detectar o ignorar puntos de aceso escondido.',
      detectHiddenTrue: 'Detectar',
      detectHiddenFalse: 'Ignorar'
    },
    signalStrength: {
      listHeader: 'Selecciona un punto de acceso para ver la fuerza de su senal',
      minLevel: 'Nivel Minimo',
      currentLevel: 'Nivel Actual',
      maxLevel: 'Nivel Maximo',
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
      legendHeader: 'Selecciona un punto de acceso para destacarlo',
      axisLabel: 'Nivel (dBm)',
      tour: {
        intro: "This interactive graph displays the observed signal strength of"
            + " each access point over time and is updated every half second.",

        filter: "The filter button allows you to search for, select, or elimate certain"
            + " access points that are displayed on the graph.",
      }
    }
  };

})();
