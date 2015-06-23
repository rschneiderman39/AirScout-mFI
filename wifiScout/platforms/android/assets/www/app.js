console.log("IN APP.JS");

var app = angular.module('wifiApp', ['ngRoute']);
  
app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/settings.html',
        })
        .when('/channels', {
            templateUrl: 'views/channels.html',
        })
        .when('/table', {
            templateUrl: 'views/table.html'
        })
        .when('/timeGraph', {
            templateUrl: 'views/timeGraph.html'
        })
        .when('/singleSpeed', {
            templateUrl: 'views/singleSpeed.html'
        })
        .when('/parabola', {
            templateUrl: 'views/parabola.html'
        })
        .otherwise({
            redirectTo: 'views/settings.html'
        });
});

app.service("tableService", function($http, $q) {
    console.log("IN TABLE SERVICE");
    var deferred = $q.defer();
    $http.get('sampleData.json').then(function (data) {
        deferred.resolve(data);
    });

    this.getAPS = function () {
        return deferred.promise;
    }
});

app.controller("tableCtrl", function($scope, tableService) {
    console.log("IN TABLE CONTROLLER");
    var promise = tableService.getAPS();
    promise.then(function (data) {
        $scope.accesspoints = data;
        console.log("HERE");
        console.log($scope.accesspoints);
    })
});