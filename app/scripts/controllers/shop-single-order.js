'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:ShopSingleOrderCtrl
 * @description
 * # ShopSingleOrderCtrl
 * Controller of the minovateApp
 */
app
    .controller('SingleOrderCtrl',['$scope', '$state', '$http', 'appSettings','services','$stateParams',
    function($scope, $state, $http, appSettings, services, $stateParams) {
    	console.log("ssss", $stateParams.driver_id);
        $scope.page = {
            title: 'Single Order',
            subtitle: 'Place subtitle here...'
        };

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
