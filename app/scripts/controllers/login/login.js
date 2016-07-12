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

    $scope.isAdmin = false;   

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
            constants.userRole = response.data.role;
            if(constants.userRole == 'admin'){
                $scope.isAdmin = true;
                $window.sessionStorage['UserRole'] = constants.userRole;
                $window.sessionStorage['user'] = JSON.stringify(constants.user);
                $state.go('app.dashboard');
            }else{
                $scope.isAdmin = false;
                $window.sessionStorage['UserRole'] = constants.userRole;
                $window.sessionStorage['user'] = JSON.stringify(constants.user);
                $state.go('app.driver.drivers');
            }
            notify({ classes: 'alert-success',message:response.message});
       }, function(error){
           if(error && error.message)
           notify({ classes: 'alert-danger', message: error.message });
           $state.go('core.login');
       });
    };
  }]);
