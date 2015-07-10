/* Globals */
var REQUIRE_CORDOVA = true

/*var app = angular.module('app', ['ngRoute', 'fsCordova', 'checklist-model', 'chart.js']);

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
});*/

var app = angular.module('app', ['ui.router', 'fsCordova', 'checklist-model', 'chart.js', 'ngTouch']);

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('settings');
    
    $stateProvider
        .state('Settings', {
            url: "/settings",
            templateUrl: 'views/settings.html'
        })
        .state('Channels', {
            url: "/channels",
            templateUrl: 'views/channels.html'
        })
        .state('Table', {
            url: "/table",
            templateUrl: 'views/table.html'
        })
        .state('Plot', {
            url: "/plot",
            templateUrl: 'views/plot.html'
        })
        .state('Performance', {
            url: "/performance",
            templateUrl: 'views/performance.html'
        })
        .state('Parabola', {
            url: "/parabola",
            templateUrl: 'views/parabola.html'
        })
});
