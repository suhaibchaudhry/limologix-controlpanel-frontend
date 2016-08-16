'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:PendingDispatchesCtrl
 * @description
 * # PendingDispatchesCtrl
 * Controller of the minovateApp
 */
app
    .controller('PendingDispatchesCtrl',[
        '$scope',
        '$http',
        'appSettings',
        'services',
        'notify',
        '$rootScope',
        'countriesConstant',
         function($scope, $http, appSettings,services,notify,$rootScope,constant) {
          $scope.page = {
            title:'Pending Dispatches',
            subtitle :''
          }
           $scope.isEmptyPendingTrips = false;
           if (constant.userRole == 'admin') {
               getPendingList();
           }

          function getPendingList() {
              var url = appSettings.serverPath + appSettings.serviceApis.tripPending;
              $scope.data = {
                    "page": 0,
                    "per_page": 0,
                    'trip_status': 'pending'
              }
              services.funcPostRequest(url,$scope.data).then(function(response) {
                  if(response.data){
                      $scope.pending_dispatch_count = Object.keys(response.data.trips).length;
                      $scope.tripList = response.data.trips;
                      $scope.isEmptyPendingTrips = false;
                  }else{
                       $scope.isEmptyPendingTrips = true;
                  }
                  
              }, function(error) {
                  notify({ classes: 'alert-danger', message: error });
              });
          }

    }]);
    
