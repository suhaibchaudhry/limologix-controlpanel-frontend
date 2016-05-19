'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the limoLogixApp
 */
app
  .controller('LogoutCtrl',['$scope','$state','$http','appSettings','notify','$rootScope','$window','services',function ($scope, $state,$http,appSettings,notify,$rootScope,$window,services) {
  	  var url = appSettings.serverPath + appSettings.serviceApis.logout;
      var token = $window.sessionStorage['Auth-Token'];
      services.funcGetRequest(url).then(function(response,status) {
          $state.go('core.login');         
          notify({ classes: 'alert-success',message:response.message});
          delete $window.sessionStorage['Auth-Token'];
      },function(error){
          notify({ classes: 'alert-danger', message: response.message });
          $state.go('core.login');
          delete $window.sessionStorage['Auth-Token'];
      });
}]);
