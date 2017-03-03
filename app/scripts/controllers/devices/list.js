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
            if($scope.global.isSignedIn()){
                $state.go("app.devices-edit", { deviceId: params });
            }
      }
      
      $scope.connectProcedureServere = function(device){
          
      }
      
      $scope.remove = function (device) {

        device.remove().then(
          function () {

            $location.path('/app/devices-list');
            /*
             for (var i in $scope.devices) {
             if ($scope.devices[i] === device) {
             $scope.devices.splice(i, 1);
             }
             }
             */
          }

          /*,
           function (error) {
           var validationErrorMessage = {};
           validationErrorMessage.path = 'Error';
           validationErrorMessage.type = error.data.message;
           $scope.serverSideFormErrors.push(validationErrorMessage);
           }*/

        );

      };


    });

})();
