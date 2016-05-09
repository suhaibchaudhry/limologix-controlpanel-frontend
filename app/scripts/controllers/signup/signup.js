'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the limoLogixApp
 */
app
  .controller('SignupCtrl',['$scope','$state','$http','appSettings','notify',function ($scope, $state,$http,appSettings,notify) {
  	$scope.user = {
  		 'uid' :'',
  		 'user_name':'',
       'password':''
  	}

    $scope.register = function() {
      $scope.user = {
          uid : $scope.user.uid,
          user_name:$scope.user.user_name,
          password:$scope.user.password
        }
        var url = appSettings.serverPath + appSettings.serviceApis.registration;

        $http.post(url,$scope.user).success( function(response,status) {
            $scope.registerSuccess = response; 
            $state.go('app.company.details');         
            notify({ classes: 'alert-success',message:$scope.registerSuccess.message});
        })
        .error(function(response,status){
            $scope.registerSuccess = response; 
            notify({ classes: 'alert-danger', message: $scope.registerSuccess.message });
            $state.go('core.signup');
        });
    }
  }]);

