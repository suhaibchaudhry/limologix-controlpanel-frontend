'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:SingleDriverCtrl
 * @description
 * # SingleDriverCtrl
 * Controller of the minovateApp
 */
app
    .controller('SingleDriverCtrl',['$scope', '$state', '$http', 'appSettings','services','$stateParams',
    function($scope, $state, $http, appSettings, services, $stateParams) {
        console.log("ssss", $stateParams.driver_id);
        $scope.page = {
            title: 'Single Driver',
            subtitle: '',//'Place subtitle here...'
        };
        $scope.imagePath =  appSettings.server_address;
        // $scope.driver_id = $state.get('driver_id') || undefined;

        funcGetDetails();

        function funcGetDetails(){
            
                var url = appSettings.serverPath + appSettings.serviceApis.getIndividualDriverDetail;
                var postData = {
                    "driver":{
                        "id" : $stateParams.driver_id
                    }
                };
                services.funcPostRequest(url, postData).then(function(response) {
                    $scope.driversList = response.data.driver;
                    console.log("driversList",$scope.driversList);
                });
        }
        //getIndividualDriverDetails();
            
    }]);            
