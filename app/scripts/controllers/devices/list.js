(function () {
  'use strict';

  // Main page controller
  angular.module('meanr')
    .controller('DevicesListCtrl', function ($scope, Global, Restangular, Go, $state) {

      $scope.global = Global;

      $scope.go = Go;

      Restangular.one('devices').get().then(function (devices) {
        $scope.devices = _.toArray(devices);
      });
      
      $scope.clickThis=function(params) {
            $state.go("app.devices-edit", { deviceId: params });
      }


    });

})();
