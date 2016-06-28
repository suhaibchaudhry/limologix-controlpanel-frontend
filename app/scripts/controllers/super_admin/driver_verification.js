'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:DriverVerificationCtrl
 * @description
 * # DriverVerificationCtrl
 * Controller of the limoLogixApp
 */
app
  .controller('DriverVerificationCtrl',
    ['$scope','$state','$http','appSettings','notify','$window','services','countriesConstant',
    function ($scope, $state,$http,appSettings,notify, $window,services, constants) {
  	$scope.user = {
      	email :'',
      	password:''
    };
    $scope.login = function() {
      $scope.user = {
      	email : 'superadmin@limologix.com',
      	password : 'Limologix@1234'
      }
      var url = appSettings.serverPath + appSettings.serviceApis.super_admin_sign_in;
      services.funcPostRequest(url,$scope.user).then(function(response){
            $http.defaults.headers.common['Auth-Token'] = response.data['Auth-Token'];
            $window.sessionStorage['Auth-Token'] = response.data['Auth-Token'];
            constants.superadmin = response.data;
            constants.superadmin.name = response.data.full_name;
            $window.sessionStorage['superadmin'] = JSON.stringify(constants.superadmin);
            $state.go('app.driver_verification');         
            notify({ classes: 'alert-success',message:response.message});
       }, function(error){
           if(error && error.message)
           notify({ classes: 'alert-danger', message: error.message });
           $state.go('core.super_admin_login');
       });
    };
  }]);
