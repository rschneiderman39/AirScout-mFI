"use strict";

app.controller('settingsCtrl', ['$scope', '$location', 'globalSettings',
'setupService', function($scope, $location, globalSettings, setupService) {

  setupService.ready.then(function() {

    $scope.strings = globals.strings;

    $scope.setStartingView = function(view) {
      globalSettings.startingView(view);
    };

    function init() {
      prepView();
    };

    function prepView() {
      $(".dropdown-menu li a").click(function(){
        var selText = $(this).text();
        $(this).parents('.btn-group').find('.dropdown-toggle').html( selText + '  <span class="caret"></span>');
        $(".selectedStartingView").dropdown('toggle');
      });

      $("[name='filteringOptions']").bootstrapSwitch({
      	onText: globals.strings.settings.globalAccessPointSelectionTrue,
      	offText: globals.strings.settings.globalAccessPointSelectionFalse
      });

      $("[name='hiddenAPOptions']").bootstrapSwitch({
      	onText: globals.strings.settings.detectHiddenTrue,
      	offText: globals.strings.settings.detectHiddenFalse
      });

      $('input[name="filteringOptions"]').bootstrapSwitch('state', globalSettings.globalAccessPointSelection());
      $('input[name="hiddenAPOptions"]').bootstrapSwitch('state', globalSettings.detectHidden());
      $('.selectedStartingView').html(globals.strings.viewTitles[globalSettings.startingView()] + '  <span class="caret"></span>');

      $('input[name="filteringOptions"]').on('switchChange.bootstrapSwitch', function(event, state) {
      	globalSettings.globalAccessPointSelection(state);
      });

      $('input[name="hiddenAPOptions"]').on('switchChange.bootstrapSwitch', function(event, state) {
      	globalSettings.detectHidden(state);
      });
    };

    init();
  });

}]);
