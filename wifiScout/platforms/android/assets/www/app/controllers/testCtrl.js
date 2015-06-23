app.controller('testCtrl', function($scope, infoService, cordovaService) {
    cordovaService.ready.then(
      function resolved() {
        $scope.buttonText = "default";

        $scope.alertInfo = function() {
          infoService.updateInfo();
          infoService.getInfo()
          .done(function(data) {alert(data);})
          .fail(function() {alert("Failed to fetch data.");})
          $scope.buttonText = "changed";
        };
      },
      function rejected() {
        console.log("testCtrl is unavailable because Cordova is not loaded.")
      }
    );
  }
);
    /*
    infoService.updateInfo();
    infoService.getInfo().done(
      function(type) {
        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';

        alert('Connection type: ' + states[type]);
      }
    ).fail(
      function() {
        alert("Failed to get data.");
      }
    );
    */
