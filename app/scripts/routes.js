(function () {
  'use strict';

// Enable HTML5 Location Mode
  angular.module('meanr')
    .config(['$locationProvider', function ($locationProvider) {
      $locationProvider.hashPrefix('!');
    }
    ]);

// Application routing
  angular.module('meanr')
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider.

        when('/', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl'
        }).

        when('/404', {
          templateUrl: 'views/404.html'
        }).

        when('/error', {
          templateUrl: 'error.html'
        }).

        when('/signin', {
          templateUrl: 'views/users/signin.html',
          controller: 'UsersCtrl'
        }).

        when('/signup', {
          templateUrl: 'views/users/signup.html',
          controller: 'UsersCtrl'
        }).

        when('/language', {
          templateUrl: 'views/language.html'
        }).

        when('/about', {
          templateUrl: 'views/about.html'
        }).

        when('/articles', {
          templateUrl: 'views/articles/list.html',
          controller: 'ArticlesListCtrl'
        }).

        when('/articles/create', {
          templateUrl: '/articles/create',
          controller: 'ArticlesCreateCtrl'
        }).

        when('/articles/:articleId/edit', {
          templateUrl: '/articles/edit',
          controller: 'ArticlesEditCtrl'
        }).

        when('/articles/:articleId', {
          templateUrl: 'views/articles/show.html',
          controller: 'ArticlesShowCtrl'
        }).
           
        when('/devices/create', {
          templateUrl: '/devices/create',
          controller: 'DevicesCreateCtrl'
        }).

        when('/devices/:deviceId/edit', {
          templateUrl: '/devices/edit',
          controller: 'DevicesEditCtrl'
        }).

        when('/devices/:deviceId', {
          templateUrl: 'views/devices/show.html',
          controller: 'DevicesShowCtrl'
        }).
                
        when('/devices', {
          templateUrl: 'views/devices/list.html',
          controller: 'DevicesListCtrl'
        }).

        otherwise({
          redirectTo: '/404'
        });

    }]);

})();
