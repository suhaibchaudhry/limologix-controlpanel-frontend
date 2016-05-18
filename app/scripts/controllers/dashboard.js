'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the minovateApp
 */
app
  .controller('DashboardCtrl',['$scope','$http','$rootScope','$window','appSettings',function($scope,$http,$rootScope,$window,appSettings){
    $scope.page = {
      title: 'Dashboard',
      subtitle: 'Place subtitle here...'
    };

    getCompanyInfo();
    function getCompanyInfo(){
       if($window.sessionStorage['token']){
         var url = appSettings.serverPath + appSettings.serviceApis.company_info;
         $http.post(url,{"auth_token" : $window.sessionStorage['token']}).success( function(response) {
            var response = response.data.company;
            $scope.companyInfo = {
              logoUrl:response.logo.image
            }
             displayLogo();
          });
       }
     }
    function displayLogo(){
      $scope.picFilePreview = appSettings.server_address + $scope.companyInfo.logoUrl;
    }
}]);



