angApp.controller('settingsCtrl', ['$scope', '$location', 'globalSettings',
'setupService', function($scope, $location, globalSettings, setupService) {

  setupService.ready.then(function() {
    $scope.strings = app.strings;

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

      $('.panel-group').css('top', app.format.topBar.height);
      $('.panel-group').css('width', app.format.window.width);
      $('.panel-group').css('max-height', app.format.window.height - app.format.topBar.height);

      $(".dropdown-menu li a").click(function(){
        var selText = $(this).text();
        $(this).parents('.btn-group').find('.dropdown-toggle').html( selText + '  <span class="caret"></span>');
        $(".selectedStartingView").dropdown('toggle');
      });

      $("[name='filteringOptions']").bootstrapSwitch({
      	onText: app.strings.settings.globalSelectionTrue,
      	offText: app.strings.settings.globalSelectionFalse
      });

      $('input[name="filteringOptions"]').on('switchChange.bootstrapSwitch', function(event, state) {
      	globalSettings.globalSelection(state);
      });

      $("[name='hiddenAPOptions']").bootstrapSwitch({
      	onText: app.strings.settings.detectHiddenTrue,
      	offText: app.strings.settings.detectHiddenFalse
      });

      $('input[name="hiddenAPOptions"]').on('switchChange.bootstrapSwitch', function(event, state) {
      	globalSettings.detectHidden(state);
      });

      $('input[name="filteringOptions"]').bootstrapSwitch('state', globalSettings.globalSelection());
      $('input[name="hiddenAPOptions"]').bootstrapSwitch('state', globalSettings.detectHidden());
      $('.selectedStartingView').html(app.strings.viewTitles[globalSettings.startingView()] + '  <span class="caret"></span>');
    };

    var init = function() {
      prepView();
    };

    init();
  });

}]);
