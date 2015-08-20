"use strict";

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
      .state('accessPointCount', {
        url: "/accessPointCount",
        templateUrl: 'views/accessPointCount.html',
        data: {
          css: 'css/accessPointCount.css'
        }
      })
      .state('accessPointTable', {
        url: "/accessPointTable",
        templateUrl: 'views/accessPointTable.html',
        data: {
          css: ['css/accessPointTable.css', 'css/sortArrow.css']
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
  .run(['timeGraphManager', function(timeGraphManager) {}]);
