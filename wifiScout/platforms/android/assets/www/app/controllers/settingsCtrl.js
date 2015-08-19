"use strict";

app.controller('settingsCtrl', ['$scope', '$location', 'globalSettings',
'setupService', function($scope, $location, globalSettings, setupService) {

  setupService.ready.then(function() {

    $scope.strings = globals.strings;

    $scope.setMaxSignal = function(max) {
      globalSettings.maxSignal(max);
    };

    function init() {
      prepView();
    };

    function prepView() {
      var sliderConfig = {
        min: constants.signalFloor,
        max: constants.signalCeil,
        step: 1,
        value: [globalSettings.minSignal(), globalSettings.maxSignal()],
        tooltip: 'show'
      };

      $("[name='hiddenAPOptions']").bootstrapSwitch({
      	onText: globals.strings.settings.detectHiddenTrue,
      	offText: globals.strings.settings.detectHiddenFalse
      });

      $('input[name="hiddenAPOptions"]').bootstrapSwitch('state', globalSettings.detectHidden());

      $('input[name="hiddenAPOptions"]').on('switchChange.bootstrapSwitch', function(event, state) {
      	globalSettings.detectHidden(state);
      });

      $('#range-slider').slider(sliderConfig)
        .on('slideStop', function() {
          console.log($(this).slider('getValue'));
        });

    };

    init();
  });

}]);
