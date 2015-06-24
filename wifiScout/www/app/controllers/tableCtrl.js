app.controller('tableCtrl', function($scope, tableService, cordovaService) {
    cordovaService.ready.then(
        function resolved() {
            console.log("IN TABLE CONTROLLER");
            $scope.buttons = "get table info";

            $scope.getTableInfo = function() {
                console.log("GETTING TABLE INFO");
                var promise = tableService.getAPS();

                promise.then(function (data) {
                    $scope.accesspoints = data.data.available;
                    console.log("HERE");
                    console.log($scope.accesspoints);
                    $scope.buttons = "we did it!";
                })
            };
        },
        function rejected() {
            console.log("tableCtrl is unavailable because Cordova is not loaded.")
        }
    );
});