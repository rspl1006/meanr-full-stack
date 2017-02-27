(function () {
  'use strict';

  // Main page controller
  angular.module('meanr')
    .controller('DevicesCreateCtrl', function ($scope, Restangular, $location) {

      // $scope.create and $scope.update add server side form validation errors to this array
      $scope.formValidationErrors = [];

      // AngularJS show client side validation errors as the user types.
      // We prefer to show errors only after the user leaves the input and not while focused on the input
      // This array will hold has-visited and has-focus elements which is used in $scope.showClientSideValidationErrors below.
      // Items are added and removed here by the custom lateValidateForm directive
      $scope.formElementHasStates = [];

      $scope.create = function () {

        // Any server side validations errors here
        var serverSideFormValidationErrors = [];

        var device = {
          client_sw_no: this.client_sw_no,
          client_dev_no: this.client_dev_no,
          client_public_key: this.client_public_key,
          client_certificate: this.client_certificate
        };

        Restangular.all('devices').post(device).then(

          function (success) {

            // reset form fields
            $scope.client_sw_no = '';
            $scope.client_dev_no = '';
            $scope.client_public_key = '';
            $scope.client_certificate = '';

            // locate to view path
            $location.path('/devices/' + success._id);
          },

          function (error) {
            var validationErrorMessage = {};
            if (error.data.message) {
              // auth error, not logged in (nefarious URL tampering to load templates manually)
              validationErrorMessage.path = 'Error';
              validationErrorMessage.type = error.data.message;
              serverSideFormValidationErrors.push(validationErrorMessage);
            } else {
              // logged in validation error
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

      // Check if form is valid
      $scope.canSave = function () {
        return $scope.deviceForm.$dirty && $scope.deviceForm.$valid;
      };

      $scope.showClientSideValidationErrors = function (ngModelController, error) {

        // Build form element state string for this model controller
        var hasVisited = ngModelController.$name + '-' + 'has-visited';
        var hasFocus = ngModelController.$name + '-' + 'has-focus';

        // Check if the elemenet has been visited and does not have focus
        if (_.contains($scope.formElementHasStates, hasVisited) && !_.contains($scope.formElementHasStates, hasFocus)) {

          // Return true or false for this validation
          return ngModelController.$error[error];
        }
        else {
          return null;
        }

      };

    });

})();
