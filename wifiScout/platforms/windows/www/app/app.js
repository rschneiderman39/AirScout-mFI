"use strict";

var app = angular.module('app', ['ngAnimate', 'ngTouch', 'ui.router', 'nzTour', 'setup'])
  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('settings', {
        templateUrl: 'views/settings.html'
      })
      .state('accessPointCount', {
        templateUrl: 'views/accessPointCount.html'
      })
      .state('accessPointTable', {
        templateUrl: 'views/accessPointTable.html'
      })
      .state('timeGraph', {
        templateUrl: 'views/timeGraph.html'
      })
      .state('signalStrength', {
        templateUrl: 'views/signalStrength.html'
      })
      .state('channelGraph', {
        templateUrl: 'views/channelGraph.html'
      });
  })
  .run(['timeGraphManager', function(timeGraphManager) {}]);
