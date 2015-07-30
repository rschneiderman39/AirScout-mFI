app.controller('settingsCtrl', ['$scope', '$location', 'globalSettings',
'setupService', function($scope, $location, globalSettings, setupService) {

  setupService.ready.then(function() {
    $scope.strings = globals.strings;

    $scope.setStartingView = function(view) {
      globalSettings.startingView(view);
    };

    $scope.$on('animIn', function() {
            console.log('settingsCtrl: animIn');
    });

    $scope.$on('animOut', function() {
      console.log('settingsCtrl: animOut');
    });

    var prepView = function() {
      var optionsHeight = $('#accordion').height();

      $('.panel-group').css('top', globals.format.topBar.height);
      $('.panel-group').css('width', globals.format.window.width);
      $('.panel-group').css('max-height', globals.format.window.height - globals.format.topBar.height);

      $(".dropdown-menu li a").click(function(){
        var selText = $(this).text();
        $(this).parents('.btn-group').find('.dropdown-toggle').html( selText + '  <span class="caret"></span>');
        $(".selectedStartingView").dropdown('toggle');
      });

      $("[name='filteringOptions']").bootstrapSwitch({
      	onText: globals.strings.settings.globalSelectionTrue,
      	offText: globals.strings.settings.globalSelectionFalse
      });

      $("[name='hiddenAPOptions']").bootstrapSwitch({
      	onText: globals.strings.settings.detectHiddenTrue,
      	offText: globals.strings.settings.detectHiddenFalse
      });

      $('input[name="filteringOptions"]').bootstrapSwitch('state', globalSettings.globalSelection());
      $('input[name="hiddenAPOptions"]').bootstrapSwitch('state', globalSettings.detectHidden());
      $('.selectedStartingView').html(globals.strings.viewTitles[globalSettings.startingView()] + '  <span class="caret"></span>');

      $('input[name="filteringOptions"]').on('switchChange.bootstrapSwitch', function(event, state) {
      	globalSettings.globalSelection(state);
      });

      $('input[name="hiddenAPOptions"]').on('switchChange.bootstrapSwitch', function(event, state) {
      	globalSettings.detectHidden(state);
      });
    };

    var init = function() {
      prepView();
    };

    init();
  });

}]);
