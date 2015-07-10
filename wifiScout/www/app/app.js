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
        .state('Channel Table', {
            url: "/channelTable",
            templateUrl: 'views/channelTable.html'
        })
        .state('AP Table', {
            url: "/apTable",
            templateUrl: 'views/apTable.html'
        })
        .state('Time Graph', {
            url: "/timeGraph",
            templateUrl: 'views/timeGraph.html'
        })
        .state('Signal Strength', {
            url: "/signalStrength",
            templateUrl: 'views/signalStrength.html'
        })
        .state('Channel Graph', {
            url: "/channelGraph",
            templateUrl: 'views/channelGraph.html'
        })
});
