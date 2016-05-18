'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the limoLogixApp
 */
app
  .controller('SignupCtrl',['$scope','$state','$http','appSettings','notify','$window',function ($scope, $state,$http,appSettings,notify,$window) {
  	$scope.register = function() {
      var user = {
        username : $scope.user.username,
        password : $scope.user.password,
        email : $scope.user.email
      };
      var company = {
        name : $scope.company.name,
        email : $scope.company.email
      };
      var signupDetails = {
           "user" : user,
           "company": company
      }
      var url = appSettings.serverPath + appSettings.serviceApis.registration;
      $http.post(url,signupDetails).success( function(response,status) {
        $http.defaults.headers.common['token'] = response.data.auth_token;
        $window.sessionStorage['token'] = response.data.auth_token;
        $state.go('app.company.details');         
        notify({ classes: 'alert-success',message:response.message});
      })
      .error(function(response,status){
        notify({ classes: 'alert-danger', message: response.message });
        $state.go('core.signup');
      });
    }
  }]);

