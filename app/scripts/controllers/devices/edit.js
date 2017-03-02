(function () {
  'use strict';

  // Main page controller
  angular.module('meanr')
    .controller('DevicesEditCtrl', function ($scope, Global, $cookies, Restangular, $routeParams, $location,$stateParams) {

      $scope.global = Global;

      // For upload image form
      $scope.csrfToken = $cookies['XSRF-TOKEN'];

      // $scope.create and $scope.update add server side form validation errors to this array
      // The displayServerSideErrors directive $watches this object and displays on screen
      $scope.formValidationErrors = [];

      // AngularJS show client side validation errors as the user types.
      // We prefer to show errors only after the user leaves the input and not while focused on the input
      // This array will hold has-visited and has-focus elements which is used in $scope.showClientSideValidationErrors below.
      // Items are added and removed here by the custom lateValidateForm directive
      $scope.formElementHasStates = [];

      // Keep a copy of original ridesahare details
      $scope.deviceOrig = {};

      Restangular.one('devices').one($stateParams.deviceId).get().then(function (device) {
        $scope.device = device;
        $scope.deviceOrig = _.pick(device, 'title', 'content');

        // After scope device has been set add a method used to enable/disable the update form submit button
        $scope.canUpdate = function () {

          if (($scope.device.title !== $scope.deviceOrig.title) ||
            ($scope.device.content !== $scope.deviceOrig.content)
            ) {
            return true;
          }
          else {
            return false;
          }
        };

      });

      $scope.update = function () {

        var device = $scope.device;

        // Any server side validations errors here
        var serverSideFormValidationErrors = [];

        /*
         if (!device.updated) {
         device.updated = [];
         }

         var updated_at = new Date().getTime();
         device.updated.push(updated_at);
         */

        device.put().then(
          function () {
            $location.path('/app/devices-list');
          },
          function (error) {

            var validationErrorMessage = {};
            if (error.data.message) {
              // auth error, not logged in (nefarious URL tampering to load templates manually)
              validationErrorMessage.path = 'Error';
              validationErrorMessage.type = error.data.message;
              serverSideFormValidationErrors.push(validationErrorMessage);
            } else {
              // display serverside validation errors
              for (var field in error.data) {
                validationErrorMessage = {};
                validationErrorMessage.path = error.data[field].path;
                validationErrorMessage.message = error.data[field].message;
                serverSideFormValidationErrors.push(validationErrorMessage);
              }
            }

            // Update scope formErrors
            $scope.formValidationErrors = serverSideFormValidationErrors;

          }
        );
      };

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
