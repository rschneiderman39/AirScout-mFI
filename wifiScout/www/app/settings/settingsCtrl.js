"use strict";

app.controller('settingsCtrl', ['$scope', 'globals', 'globalSettings',
'setupSequence', function($scope, globals, globalSettings, setupSequence) {

  setupSequence.done.then(function() {

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
        min: globals.constants.signalFloor,
        max: globals.constants.signalCeil,
        step: prefs.sliderStep,
        /* Both values must be negative or the bootstrap-slider plugin freaks out */
        value: [globalSettings.visScaleMin(), globalSettings.visScaleMax()],
        tooltip: 'hide'
      };

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
              if ($scope.visScaleMax === globals.constants.signalCeil) {
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
