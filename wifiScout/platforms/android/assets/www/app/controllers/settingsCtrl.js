app.controller('settingsCtrl', ['$scope', '$location', 'globalSettings',
'setupService', function($scope, $location, globalSettings, setupService) {

  setupService.ready.then(function() {
    $scope.strings = strings;

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

      $('.panel-group').css('top', dimensions.topBar.height);
      $('.panel-group').css('width', dimensions.window.width);
      $('.panel-group').css('max-height', dimensions.window.height - dimensions.topBar.height);

      $(".dropdown-menu li a").click(function(){
        var selText = $(this).text();
        $(this).parents('.btn-group').find('.dropdown-toggle').html( selText + '  <span class="caret"></span>');
        $(".selectedStartingView").dropdown('toggle');
      });

      $("[name='filteringOptions']").bootstrapSwitch({
      	onText: strings.settings.globalSelectionTrue,
      	offText: strings.settings.globalSelectionFalse
      });

      $("[name='hiddenAPOptions']").bootstrapSwitch({
      	onText: strings.settings.detectHiddenTrue,
      	offText: strings.settings.detectHiddenFalse
      });

      $('input[name="filteringOptions"]').bootstrapSwitch('state', globalSettings.globalSelection());
      $('input[name="hiddenAPOptions"]').bootstrapSwitch('state', globalSettings.detectHidden());
      $('.selectedStartingView').html(strings.viewTitles[globalSettings.startingView()] + '  <span class="caret"></span>');

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
