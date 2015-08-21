"use strict";

var app = angular.module('app', ['ngAnimate', 'ui.router', 'uiRouterStyles', 'setup', 'ngTouch', 'nzTour'])
  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('settings', {
        url: "/settings",
        templateUrl: 'views/settings.html',
      })
      .state('accessPointCount', {
        url: "/accessPointCount",
        templateUrl: 'views/accessPointCount.html',
      })
      .state('accessPointTable', {
        url: "/accessPointTable",
        templateUrl: 'views/accessPointTable.html',
      })
      .state('timeGraph', {
        url: "/timeGraph",
        templateUrl: 'views/timeGraph.html'
      })
      .state('signalStrength', {
        url: "/signalStrength",
        templateUrl: 'views/signalStrength.html',
      })
      .state('channelGraph', {
        url: "/channelGraph",
        templateUrl: 'views/channelGraph.html',
      });
  })
  .run(['timeGraphManager', function(timeGraphManager) {}]);
