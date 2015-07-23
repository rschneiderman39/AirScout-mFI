/* Globals */
var REQUIRE_CORDOVA = true

var app = angular.module('app', ['ui.router', 'ngAnimate', 'anim-in-out', 'fsCordova', 'ngTouch']);

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('settings');

    $stateProvider
        .state('settings', {
            url: "/settings",
            templateUrl: 'views/settings.html',
            controller: 'settingsCtrl'
        })
        .state('channelTable', {
            url: "/channelTable",
            templateUrl: 'views/channelTable.html',
            controller: 'channleTableCtrl'
        })
        .state('APTable', {
            url: "/APTable",
            templateUrl: 'views/APTable.html',
            controller: 'APTableCtrl'
        })
        .state('timeGraph', {
            url: "/timeGraph",
            templateUrl: 'views/timeGraph.html',
            controller: 'timeGraphCtrl'
        })
        .state('signalStrength', {
            url: "/signalStrength",
            templateUrl: 'views/signalStrength.html',
            controller: 'signalStrengthCtrl'
        })
        .state('channelGraph', {
            url: "/channelGraph",
            templateUrl: 'views/channelGraph.html',
            controller: 'channelGraphCtrl'
        })
});
