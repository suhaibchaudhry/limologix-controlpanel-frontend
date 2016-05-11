'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the limoLogixApp
 */
app
  .controller('LoginCtrl',['$scope','$state','$http','appSettings','notify',function ($scope, $state,$http,appSettings,notify) {
  	$scope.user = {
      	uid :'',
      	password:''
    };
    $scope.login = function() {
      $scope.user = {
       //  user_name:'',
      	// uid : $scope.user.uid,
      	user_name:$scope.user.user_name,
      	password:$scope.user.password
      }
      var url = appSettings.serverPath + appSettings.serviceApis.signin;

      $http.post(url,$scope.user).success( function(response,status) {
          $http.defaults.headers.common['token'] = response.data.auth_token;
          $window.sessionStorage['token'] = response.data.auth_token;
          //console.log('auth_token',$window.sessionStorage['token'])
          $state.go('app.company.details');         
          notify({ classes: 'alert-success',message:response.message});
      })
      .error(function(response,status){
          notify({ classes: 'alert-danger', message: response.message });
          $state.go('core.login');
      });
      
     
    };
  }]);
