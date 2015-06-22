var app = angular.module('wifiApp', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/settings.html',
            controller: settingsCtrl
        })
        .when('/channels', {
            templateUrl: 'views/channels.html',
            controller: channelsCtrl
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

app.factory('Page', function () {
    console.log("PAGE THINGS WE ARE IN PAGE");
    var title = 'default';
    return {
        printTitle: function () {
            console.log("RETURNING TITLE");
            return title;
        },
        setTitle: function (newTitle) {
            console.log("SETTING TITLE: " + newTitle);
            title = newTitle;
        }
    };
});

function MainCtrl($scope, Page) {
    $scope.Page = Page;
}

function settingsCtrl($scope, Page) {
    Page.setTitle('WOOO SETTINGS TITLE');
}
function channelsCtrl($scope, Page) {
    Page.setTitle('WOOO CHANNELS TITLE');
}