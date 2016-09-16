'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:SingleCompletedDispatchCtrl
 * @description
 * # SingleCompletedDispatchCtrl
 * Controller of the minovateApp
 */
app
    .controller('SingleCompletedDispatchCtrl', ['$scope', '$window', '$state', '$http', 'dispatchRideProvider', 'notify', 'appSettings', 'services', '$stateParams',
       
        function($scope, $state, $window, $http, dispatchRideProvider, notify, appSettings, services, $stateParams) {
            $scope.page = {
                title: 'Dispatch Details',
                subtitle: '', //'Place subtitle here...'
            };
            $scope.imagePath = appSettings.server_address;
            $scope.isDispatchActive = false;
            getActiveList();

            function getActiveList() {
                var url = appSettings.serverPath + appSettings.serviceApis.tripSummary;
                services.funcPostRequest(url, { 'trip_id': parseInt($stateParams.trip_id)}).then(function(response) {
                    //$scope.pending_dispatch_count = Object.keys(response.data.trip).length;
                    $scope.dispatch_data = response.data.trip;
                    $scope.dispatch_customer = response.data.trip.first_name + response.data.trip.last_name;
                    $scope.dispatch_source = response.data.trip.start_destination;
                    $scope.dispatch_destination = response.data.trip.end_destination;
                   // $scope.dispatch_driver = response.data.trip.driver;
                    //get driver info only when dispatch status is active
                    if(response.data.trip.driver){
                        $scope.isDispatchActive = true;
                        $scope.dispatch_driver = response.data.trip.driver;
                    }else{
                        $scope.isDispatchActive = false;
                    }
                       

                    // $scope.channelName = response.data.trips[0].driver.channel;
                    //subscribeToChannel();
                }, function(error) {
                    notify({ classes: 'alert-danger', message: error });
                });
            }

//             setTimeout(function() {
//                 dispatchRideProvider.getRoutes($scope.dispatch_source.place,$scope.dispatch_destination.place, notify);
//             }, 5000)


        }
    ])
    