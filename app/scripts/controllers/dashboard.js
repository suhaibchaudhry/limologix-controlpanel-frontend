'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the minovateApp
 */
app
  .controller('DashboardCtrl', function($scope,$http,$rootScope){
    $scope.page = {
      title: 'Dashboard',
      subtitle: 'Place subtitle here...'
    };
    displayLogo();
    function displayLogo(){
      $scope.picFilePreview = '../images/flags/Vatican-City.png';
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



