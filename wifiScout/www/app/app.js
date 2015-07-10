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
        .state('settings', {
            url: "/settings",
            templateUrl: 'views/settings.html'
        })
        .state('channelTable', {
            url: "/channelTable",
            templateUrl: 'views/channelTable.html'
        })
        .state('APTable', {
            url: "/APTable",
            templateUrl: 'views/APTable.html'
        })
        .state('timeGraph', {
            url: "/timeGraph",
            templateUrl: 'views/timeGraph.html'
        })
        .state('signalStrength', {
            url: "/signalStrength",
            templateUrl: 'views/signalStrength.html'
        })
        .state('channelGraph', {
            url: "/channelGraph",
            templateUrl: 'views/channelGraph.html'
        })
});
