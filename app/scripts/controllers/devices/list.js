(function () {
  'use strict';

  // Main page controller
  angular.module('meanr')
    .controller('DevicesListCtrl', function ($scope, Global, Restangular, Go, $state,mySocket) {

        $scope.showModal = false;
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
//          var namespace='/pod';
//        var socket = mySocket.connect('http://localhost:5000'+namespace,{secure: false});
        mySocket.emit('subscribe',device.client_dev_no);
        console.log(mySocket);
        device.connected = true;
      }
      
      $scope.checkconnected = function(device){
          if(device.connected)
            return true;
        else
            return false;
      }
      
      $scope.showProcedure = function (device){
//          console.log("Calling");
//          Restangular.one('devices/runpython').get().then(function (obj) {
//              
//          });
          mySocket.on('frompoddata', function(msg){
            if (msg!== undefined) {
              console.log("EEEEEEE:"+msg);
              $(".procedureServer").append("<li>"+msg+"</li>");
            }
            else {
                console.log("Nothing");
            }
          });
          $(".procedureServer").hide();
          $("#procedureServer_"+device._id).show();
          $scope.showModal = !$scope.showModal;
      }
      
      $scope.remove = function (devicePass) {
Restangular.one('devices').one(devicePass._id).get().then(function (device) {
        device.remove().then(
          function () {

            
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
});
$state.go('app.devices-list');
      };


    });

})();
