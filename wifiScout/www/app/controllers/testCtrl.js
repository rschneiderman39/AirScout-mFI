wifiApp.controller('testCtrl', function($scope, infoService) {
    $scope.buttonText = "default";

    $scope.alertInfo = function() {
      $scope.buttonText = "changed";
    };
});
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
