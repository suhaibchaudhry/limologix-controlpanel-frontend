'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:SuperAdminLoginCtrl
 * @description
 * # SuperAdminLoginCtrl
 * Controller of the limoLogixApp
 */
app
  .controller('SuperAdminLoginCtrl',
    ['$scope','$state','$http','appSettings','notify','$window','services','countriesConstant','$rootScope',
    function ($scope, $state,$http,appSettings,notify, $window,services, constants,$rootScope) {
  	$scope.oneAtATime = false;

    $scope.status = {
      isFirstOpen: true,
      isSecondOpen: true,
      isThirdOpen: true
    };
    $scope.user = {
      	email :'',
      	password:''
    };
    $scope.userType = {
      superAdmin : true,
      admin:false
    }
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
            $scope.userType.superAdmin = true;
            console.log('superadmin',$scope.userType.superAdmin);
            $state.go('app.driver.drivers');         
            notify({ classes: 'alert-success',message:response.message});
       }, function(error){
           if(error && error.message)
           notify({ classes: 'alert-danger', message: error.message });
           $state.go('core.super_admin_login');
       });
    };
  }]);
