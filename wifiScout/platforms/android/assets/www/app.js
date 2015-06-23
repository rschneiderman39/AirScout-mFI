var wifiApp = angular.module('wifiApp', ['ngRoute']);

wifiApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/settings.html'
        })
        .when('/channels', {
            templateUrl: 'views/channels.html'
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
        })
});

wifiApp.controller('navController', function ($scope) {

});
