var app = angular.module('wifiApp');

app.service("tableService", function($http, $q) {
    var deferred = $q.defer();
    $http.get('sampleData.json').then(function (data) {
        deferred.resolve(data);
    });

    this.getAPS = function () {
        return deferred.promise;
    }
});

app.controller("tableCtrl", function($scope, tableService) {
    var promise = tableService.getAPS();
    promise.then(function (data) {
        $scope.accesspoints = data;
        console.log("HERE");
        console.log($scope.accesspoints);
    })
});