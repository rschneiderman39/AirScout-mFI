app.controller('channelGraphCtrl', ['$scope', 'channelGraphDataService', 'APService', 'cordovaService',
  function($scope, channelGraphDataService, APService, cordovaService) {
    cordovaService.ready.then(
      function resolved() {
      },
      function rejected() {
        console.log('channelGraphCtrl is unavailable because Cordova is not loaded.');
      }
    )
  }])
