'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the minovateApp
 */
app
  .controller('NavCtrl',[
    '$scope',
    '$rootScope',
    'countriesConstant',
    function ($scope,$rootScope,constant) {
    $scope.oneAtATime = false;

    $scope.status = {
      isFirstOpen: true,
      isSecondOpen: true,
      isThirdOpen: true
    };
    if(constant.userRole == 'admin')
      $scope.isAdmin = true;
    else 
      $scope.isAdmin = false;
  }]);
