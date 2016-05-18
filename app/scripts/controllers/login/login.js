'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the limoLogixApp
 */
app
  .controller('LoginCtrl',['$scope','$state','$http','appSettings','notify','$window',function ($scope, $state,$http,appSettings,notify, $window) {
  	$scope.user = {
      	username :'',
      	password:''
    };
    $scope.login = function() {
      $scope.user = {
      	username : $scope.user.username,
      	password : $scope.user.password
      }
      var url = appSettings.serverPath + appSettings.serviceApis.signin;
      $http.post(url,$scope.user).success( function(response,status) {
        $http.defaults.headers.common['token'] = response.data.auth_token;
        $window.sessionStorage['token'] = response.data.auth_token;
        $state.go('app.company.details');         
        notify({ classes: 'alert-success',message:response.message});
      })
      .error(function(response,status){
        notify({ classes: 'alert-danger', message: response.message });
        $state.go('core.login');
      });
    };
  }]);
