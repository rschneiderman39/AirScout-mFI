"use strict";

app.controller('settingsCtrl', ['$scope', 'globalSettings', 'setupService',
function($scope, globalSettings, setupService) {

  setupService.ready.then(function() {

    var prefs = {
      sliderStep: 10
    };

    $scope.strings = globals.strings;
    $scope.visScaleMin = globalSettings.visScaleMin();
    $scope.visScaleMax = globalSettings.visScaleMax();

    $scope.setMaxSignal = function(max) {
      globalSettings.visScaleMax(max);
    };

    function init() {
      prepView();
    };

    function prepView() {

      var sliderConfig = {
        min: constants.signalFloor,
        max: constants.signalCeil,
        step: prefs.sliderStep,
        /* Both values must be negative or the bootstrap-slider plugin freaks out */
        value: [globalSettings.visScaleMin(), globalSettings.visScaleMax()],
        tooltip: 'hide'
      };

      /*$("[name='hiddenAPOptions']").bootstrapSwitch({
        onText: globals.strings.settings.detectHiddenTrue,
        offText: globals.strings.settings.detectHiddenFalse
      });

      $('input[name="hiddenAPOptions"]').bootstrapSwitch('state', globalSettings.detectHidden());

      $('input[name="hiddenAPOptions"]').on('switchChange.bootstrapSwitch', function(event, state) {
        globalSettings.detectHidden(state);
      });*/

      $(function() {
        $('#toggle-one').bootstrapToggle({
          on: globals.strings.settings.detectHiddenTrue,
          off: globals.strings.settings.detectHiddenFalse,
          onstyle: 'success',
          offstyle: 'default',
          size: 'small'
        });
      });

      if(globalSettings.detectHidden()) {
        $('#toggle-one').bootstrapToggle('on');
      }
      else {
        $('#toggle-one').bootstrapToggle('off');
      }

      $('#toggle-one').change(function(){
        var state = $(this).prop('checked');
        globalSettings.detectHidden(state);
      });


      $('#scale-slider').slider(sliderConfig)
        .on('slide', function() {
          var rangeStr = $(this)[0].value;

          $scope.$apply(function() {
            if (rangeStr) {
              var range = rangeStr.split(',');
              $scope.visScaleMin = parseInt(range[0]);
              $scope.visScaleMax = parseInt(range[1]);
            }
          });
        })
        .on('slideStop', function() {
          $scope.$apply(function() {
            if ($scope.visScaleMin === $scope.visScaleMax) {
              if ($scope.visScaleMax === constants.signalCeil) {
                $scope.visScaleMin = $scope.visScaleMin - prefs.sliderStep;
              } else {
                $scope.visScaleMax = $scope.visScaleMax + prefs.sliderStep;
              }

              $('#scale-slider').slider('setValue',
                [$scope.visScaleMin, $scope.visScaleMax]);
            }

            globalSettings.visScaleMin($scope.visScaleMin);
            globalSettings.visScaleMax($scope.visScaleMax);
          });
        });

        $('.slider-horizontal').css('width', '100%');
    };

    init();
  });

}]);
