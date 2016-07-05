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
         function($scope, $http, appSettings,services,notify,$rootScope) {
          $scope.page = {
            title:'Pending Dispatches',
            subtitle :''
          }
          
            getPendingList();

          function getPendingList() {
              var url = appSettings.serverPath + appSettings.serviceApis.tripPending;
              services.funcPostRequest(url, { 'trip_status': 'pending' }).then(function(response) {
                  $scope.pending_dispatch_count = Object.keys(response.data.trips).length;
                  $scope.tripList = response.data.trips;
              }, function(error) {
                  notify({ classes: 'alert-danger', message: error });
              });
          }

    }]);
    
