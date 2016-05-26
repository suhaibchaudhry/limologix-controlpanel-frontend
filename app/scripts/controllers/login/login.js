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
    ['$scope','$state','$http','appSettings','notify','$window','services',
    function ($scope, $state,$http,appSettings,notify, $window,services) {
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
      services.funcPostRequest(url,$scope.user).then(function(response){
            $http.defaults.headers.common['Auth-Token'] = response.data['Auth-Token'];
            $window.sessionStorage['Auth-Token'] = response.data['Auth-Token'];
            $window.sessionStorage['username'] = $scope.user.username;
            $rootScope.username = $window.sessionStorage['username'];
            $state.go('app.company.details');         
            notify({ classes: 'alert-success',message:response.message});
       }, function(error){
           if(error && error.message)
           notify({ classes: 'alert-danger', message: error.message });
           $state.go('core.login');
       });
    };
  }]);
