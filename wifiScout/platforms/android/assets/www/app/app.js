<<<<<<< HEAD:wifiScout/platforms/android/assets/www/app/app.js
/* Globals */
var REQUIRE_CORDOVA = false

var wifiApp = angular.module('wifiApp', ['ngRoute', 'fsCordova']);

wifiApp.config(function ($routeProvider, $sceProvider) {
    $sceProvider.enabled(false);
=======
var app = angular.module('wifiApp', ['ngRoute']);

app.config(function ($routeProvider) {
>>>>>>> bc3eb313ee064b560f1db24a1a9595e90dd0e59e:wifiScout/www/app.js
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
<<<<<<< HEAD:wifiScout/platforms/android/assets/www/app/app.js
        })
});

wifiApp.controller('navController', function ($scope) {

});
=======
        });
});
>>>>>>> bc3eb313ee064b560f1db24a1a9595e90dd0e59e:wifiScout/www/app.js
