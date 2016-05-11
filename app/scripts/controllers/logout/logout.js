'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the limoLogixApp
 */
app
  .controller('LogoutCtrl',['$scope','$state','$http','appSettings','notify','$rootScope','$window',function ($scope, $state,$http,appSettings,notify,$rootScope,$window) {
  	  var url = appSettings.serverPath + appSettings.serviceApis.logout;
      var token = $window.sessionStorage['token'];
      $http.post(url,{"auth_token":token}).success( function(response,status) {
          $state.go('core.login');         
          notify({ classes: 'alert-success',message:response.message});
          delete $window.sessionStorage['token'];
      })
      .error(function(response,status){ 
          notify({ classes: 'alert-danger', message: response.message });
          $state.go('core.login');
          delete $window.sessionStorage['token'];
      });
}]);
