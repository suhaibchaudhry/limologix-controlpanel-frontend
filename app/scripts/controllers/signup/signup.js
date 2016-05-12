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
  	var vm = this; 

    $scope.register = function() {
      vm.dataLoading = true;
      var user = {};
          user.username  = $scope.user.username;
          user.password =$scope.user.password;
          user.email =$scope.user.email;
      var company = {};
          company.name  = $scope.company.name;
          company.email =$scope.company.email;

      var signupDetails = {
           "user" : user,
           "company": company
      }
        var url = appSettings.serverPath + appSettings.serviceApis.registration;

        $http.post(url,signupDetails).success( function(response,status) {
            $http.defaults.headers.common['token'] = response.data.auth_token;
            $window.sessionStorage['token'] = response.data.auth_token;
           // console.log('auth_token',$window.sessionStorage['token'])
            $state.go('app.company.details');         
            notify({ classes: 'alert-success',message:response.message});
        })
        .error(function(response,status){
            $scope.registerError = response;
            if($scope.registerError.data.user.email){
              $scope.emailError = $scope.registerError.data.user.email[0];
            }
             if($scope.registerError.data.company.email){
              $scope.company_emailError = $scope.registerError.data.company.email[0];
            }
            vm.dataLoading = false;
            if($scope.emailError != "")
              jQuery('.email_error').text('User Email' +' '+$scope.emailError);
            if($scope.company_emailError != "")
              jQuery('.company_email_error').text('Company Email' +' '+$scope.company_emailError); 
            notify({ classes: 'alert-danger', message: $scope.registerError.message });
            $state.go('core.signup');
        });
    }
  }]);

