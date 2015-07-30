if (typeof app === 'undefined') {
  app = {};
}

(function() {
  if (app.lang === undefined) {
    app.lang = {};
  }

  app.lang['es-ES'] = {
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
      sortFrequency: 'Canal',
      sortLevel: 'Nivel (dBm)',
      sortCapabilities: 'Capacidades',
    },
    channelTable : {
      label2_4: '2,4 Ghz',
      label5: '5 Ghz'
    },
    channelGraph : {
      label2_4: '2,4 Ghz',
      label5: '5 Ghz'
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
      maxLevel: 'Nivel Maximo'
    },
    timeGraph: {
      legendHeader: 'Selecciona un punto de acceso para destacarlo',
      axisLabel: 'Nivel (dBm)'
    }
  };

})();
