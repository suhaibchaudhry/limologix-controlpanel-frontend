'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the minovateApp
 */
app
  .controller('DashboardCtrl', function($scope,$http,$rootScope,$window,appSettings){
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
              logoUrl:response.logo
            }
             displayLogo();
          });
       }
     }

   
    function displayLogo(){
      $scope.picFilePreview = 'http://172.16.90.106:9000/'+ $scope.companyInfo.logoUrl;
    }
     //console.log('hiiii',$rootScope.logoUrl);

    // $scope.getUsers = function(){
    //   $scope.data=[];
    //   var url = 'http://www.filltext.com/?rows=10&fname={firstName}&lname={lastName}&delay=3&callback=JSON_CALLBACK';

    //   $http.jsonp(url).success(function(data){
    //       $scope.data=data;
    //   });
    // };

    //$scope.getUsers();
  })



