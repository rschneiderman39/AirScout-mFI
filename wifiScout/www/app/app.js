var app = angular.module('app', ['ngAnimate', 'ui.router', 'uiRouterStyles', 'setup', 'ngTouch', 'nzTour'])
  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('settings', {
        url: "/settings",
        templateUrl: 'views/settings.html',
        data: {
          css: 'css/settings.css'
        }
      })
      .state('channelTable', {
        url: "/channelTable",
        templateUrl: 'views/channelTable.html',
        data: {
          css: 'css/channelTable.css'
        }
      })
      .state('APTable', {
        url: "/APTable",
        templateUrl: 'views/APTable.html',
        data: {
          css: ['css/APTable.css', 'css/sortArrow.css']
        }
      })
      .state('timeGraph', {
        url: "/timeGraph",
        templateUrl: 'views/timeGraph.html',
        data: {
          css: 'css/timeGraph.css'
        }
      })
      .state('signalStrength', {
        url: "/signalStrength",
        templateUrl: 'views/signalStrength.html',
        data: {
          css: 'css/signalStrength.css'
        }
      })
      .state('channelGraph', {
        url: "/channelGraph",
        templateUrl: 'views/channelGraph.html',
        data: {
          css: 'css/channelGraph.css'
        }
      });
  })
  .run(['timeGraphManager', function(timeGraphManager) {
    FastClick.attach(document.body);
  }]);