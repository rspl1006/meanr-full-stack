(function () {
  'use strict';

  // Main page controller
  angular.module('meanr')
    .controller('DevicesShowCtrl', function ($scope, Global, $routeParams, Go, Restangular) {

      $scope.global = Global;

      $scope.go = Go;

      Restangular.one('devices').one($routeParams.deviceId).get().then(function (device) {
        $scope.device = device;
      });

    });

})();
