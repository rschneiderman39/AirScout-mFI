app.controller('settingsCtrl', ['$scope', '$location', 'globalSettings',
  'cordovaService', function($scope, $location, globalSettings,
  cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        $scope.setDefaultView = function(view) {
          globalSettings.defaultView(view);
        };

        $scope.$on('animIn', function() {
                console.log('settingsCtrl: animIn');
        });

        $scope.$on('animOut', function() {
          console.log('settingsCtrl: animOut');
        });

        var prepView = function() {
          var optionsHeight = $('#accordion').height();

          $('.panel-group').css('top', document.topBarHeight);
          $('.panel-group').css('width', document.deviceWidth);
          $('.panel-group').css('max-height', document.deviceHeight - document.topBarHeight);

          $(".dropdown-menu li a").click(function(){
            var selText = $(this).text();
            $(this).parents('.btn-group').find('.dropdown-toggle').html( selText +'  <span class="caret"></span>');
            $(".selectedDefaultView").dropdown('toggle');
          });

          $("[name='filteringOptions']").bootstrapSwitch({
          	onText: 'Global',
          	offText: 'Local'
          });

          $('input[name="filteringOptions"]').on('switchChange.bootstrapSwitch', function(event, state) {
          	globalSettings.globalSelection(state);
          });

          $("[name='hiddenAPOptions']").bootstrapSwitch({
          	onText: 'Shown',
          	offText: 'Hidden'
          });

          $('input[name="hiddenAPOptions"]').on('switchChange.bootstrapSwitch', function(event, state) {
          	globalSettings.detectHidden(state);
          });

          $('input[name="filteringOptions"]').bootstrapSwitch('state', globalSettings.globalSelection());
          $('input[name="hiddenAPOptions"]').bootstrapSwitch('state', globalSettings.detectHidden());
        };

        var init = function() {
          prepView();
        };

        init();
      },
      function rejected() {
        console.log("settingsCtrl is unavailable because Cordova is not loaded.");
      }
    )
  }
]);
