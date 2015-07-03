/* Globals */
var REQUIRE_CORDOVA = true

var app = angular.module('app', ['ngRoute', 'fsCordova', 'checklist-model', 'chart.js']);

app.config(function ($routeProvider, $sceProvider) {
    $sceProvider.enabled(false);
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
        .when('/plot', {
            templateUrl: 'views/plot.html'
        })
        .when('/performance', {
            templateUrl: 'views/performance.html'
        })
        .when('/parabola', {
            templateUrl: 'views/parabola.html'
        })
        .otherwise({
            redirectTo: 'views/settings.html'
        })
});
