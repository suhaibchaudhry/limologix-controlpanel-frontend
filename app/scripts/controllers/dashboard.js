'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the minovateApp
 */
app
  .controller('DashboardCtrl',[
      '$scope',
      '$http',
      '$rootScope',
      '$window',
      'appSettings',
      'services',
  function($scope,$http,$rootScope,$window,appSettings,services){
    $scope.page = {
      title: 'Dashboard',
      subtitle: 'Place subtitle here...'
    };

    getCompanyInfo();
    function getCompanyInfo(){
       if($window.sessionStorage['Auth-Token']){
         var url = appSettings.serverPath + appSettings.serviceApis.company_info;
         services.funcGetRequest(url).then(function(response){
            var response = response.data.company;
            $scope.companyInfo = {
              logoUrl:response.logo.image
            }
             displayLogo();
         }, function(error){
             
         })
       
       }
     }
    function displayLogo(){
      $scope.picFilePreview = appSettings.server_address + $scope.companyInfo.logoUrl;
    }
}]);



