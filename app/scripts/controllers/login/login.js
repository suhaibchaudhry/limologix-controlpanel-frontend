'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the limoLogixApp
 */
app
  .controller('LoginCtrl',
    ['$scope','$state','$http','appSettings','notify','$window','services','countriesConstant','$rootScope',
    function ($scope, $state,$http,appSettings,notify, $window,services, constants,$rootScope) {
  	$scope.user = {
      	email :'',
      	password:''
    };

    $scope.oneAtATime = false;

    $scope.status = {
      isFirstOpen: true,
      isSecondOpen: true,
      isThirdOpen: true
    };
    //$scope.pending_dispatch_count = 10;
   

    $scope.login = function() {
      $scope.user = {
      	email : $scope.user.useremail,
      	password : $scope.user.password
      }
      var url = appSettings.serverPath + appSettings.serviceApis.signin;
      services.funcPostRequest(url,$scope.user).then(function(response){
            $http.defaults.headers.common['Auth-Token'] = response.data['Auth-Token'];
            $window.sessionStorage['Auth-Token'] = response.data['Auth-Token'];
            constants.user = response.data;
            constants.user.name = response.data.full_name;
            $window.sessionStorage['user'] = JSON.stringify(constants.user);
            $rootScope.isSuperAdmin = false; 
            $state.go('app.dashboard');
            console.log('admin',$rootScope.isSuperAdmin);
            notify({ classes: 'alert-success',message:response.message});
       }, function(error){
           if(error && error.message)
           notify({ classes: 'alert-danger', message: error.message });
           $state.go('core.login');
       });
    };
  }]);
