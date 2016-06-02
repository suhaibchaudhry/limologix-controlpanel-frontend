'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the limoLogixApp
 */
app
  .controller('SignupCtrl',[
      '$scope',
      '$state',
      '$http',
      'appSettings',
      'notify',
      '$window',
      'services',
      'countriesConstant',
       function ($scope, $state,$http,appSettings,notify,$window,services,constants) {
        $scope.register = function() {
          var user = {
            first_name:$scope.user.first_name,
            last_name:$scope.user.last_name,
            username : $scope.user.username,
            password : $scope.user.password,
            email : $scope.user.email
          };
          var company = {
            name : $scope.company.name,
            email : $scope.company.email
          };
          var signupDetails = {
               "user" : user,
               "company": company
          }
          var url = appSettings.serverPath + appSettings.serviceApis.registration;
         services.funcPostRequest(url,signupDetails).then(function(response){
          $http.defaults.headers.common['Auth-Token'] = response.data['Auth-Token'];
          $window.sessionStorage['Auth-Token'] = response.data['Auth-Token'];
          constants.user = response.data;
          constants.user.name = response.data.username;
          $window.sessionStorage['user'] = JSON.stringify(constants.user);
          $state.go('app.dashboard'); 
                  
          notify({ classes: 'alert-success',message:response.message});
         },function(error){  
            if(error.message)    
                notify({ classes: 'alert-danger', message: error.message });
            $state.go('core.signup');
         })
        }
}]);

