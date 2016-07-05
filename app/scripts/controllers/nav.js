'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the minovateApp
 */
app
  .controller('NavCtrl', function ($scope,$rootScope) {
    $scope.oneAtATime = false;

    $scope.status = {
      isFirstOpen: true,
      isSecondOpen: true,
      isThirdOpen: true
    };
    //$scope.pending_dispatch_count = 10;
    console.log('dfdf',$rootScope.isSuperAdmin);
  });
