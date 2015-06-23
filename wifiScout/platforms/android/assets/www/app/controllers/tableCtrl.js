app.controller("tableCtrl", function($scope, tableService) {
    cordovaService.ready.then(
        function resolved() {
            var promise = tableService.getAPS();
            promise.then(function (data) {
                $scope.accesspoints = data;
                console.log("HERE");
                console.log($scope.accesspoints);
            })
        },
        function rejected() {
            console.log("tableCtrl is unavailable because Cordova is not loaded.")
        }
    );
});