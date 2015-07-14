app.controller('helpCtrl', ['$scope', 'cordovaService', function($scope, cordovaService) {
  cordovaService.ready.then(
    function resolved() {
      console.log("IN HELP CTRL");
      $scope.CompletedEvent = function () {
        console.log("Completed Event called");
      };

      $scope.ExitEvent = function () {
        console.log("Exit Event called");
      };

      $scope.ChangeEvent = function (targetElement) {
        console.log("Change Event called");
        console.log(targetElement);
      };

      $scope.BeforeChangeEvent = function (targetElement) {
        console.log("Before Change Event called");
        console.log(targetElement);
      };

      $scope.AfterChangeEvent = function (targetElement) {
        console.log("After Change Event called");
        console.log(targetElement);
      };

      $scope.IntroOptions = {
        steps:[ {
            element: document.querySelector('#step1'),
            intro: "This is the first tooltip."
        }, {
            element: document.querySelectorAll('#step2'),
            intro: "<strong>You</strong> can also <em>include</em> HTML",
            position: 'right'
        }],
        showStepNumbers: false,
        showBullets: false,
        exitOnOverlayClick: true,
        exitOnEsc:true,
        nextLabel: '<strong>Next</strong>',
        prevLabel: '<strong>Previous</strong>',
        skipLabel: 'Exit',
        doneLabel: 'Thanks'
      };
    },
    function rejected() {
      console.log("helpCtrl is unavailable because Cordova is not loaded.");
    }
  );
}]);