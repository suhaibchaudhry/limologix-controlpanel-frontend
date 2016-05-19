'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:DispatchRideRequestCtrl
 * @description
 * # DispatchRideRequestCtrl
 * Controller of the limoLogixApp
 */
app
    .controller('DispatchRideRequestCtrl', [
        '$scope',
        '$http',
        'appSettings', 
        '$window',
        'notify',
        'services',
        function($scope, $http, appSettings, $window, notify,services) {
            $scope.page = {
                title: 'Dispatch Ride Request',
                subtitle: '' //'Place subtitle here...'
            };
            $scope.phoneNumbr = /^\+?\d{1}[- ]?\d{3}[- ]?\d{3}[- ]?\d{4}$/;
            $scope.customerInfo = {
                first_name: '',
                last_name: '',
                email: '',
                mobile_number: '',
                organisation:''
            }
            $scope.selected = '';
            $scope.states = [{postcode:'B1',address:'Bull ring'},{postcode:'B1',address:'Bull ring'},{postcode:'B1',address:'Bull ring'},{postcode:'B13',address:'shyam'},{postcode:'B1',address:'Bull ring'},{postcode:'M1',address:'Manchester'}];

            $scope.getExistingCustomers = function(search_string) {
                var url = appSettings.serverPath + appSettings.serviceApis.getExistingCustomers;
                services.funcPostRequest(url,{'search_string':search_string}).then(function(response) {
                        console.log('searched customer',response);
                        notify({ classes: 'alert-success', message: response.message });
                    },function(error){
                        notify({ classes: 'alert-danger', message: response.message });  
                    });
            }

            // function to submit the form after all validation has occurred
            $scope.submitForm = function(isValid) {
                if (isValid) {
                    var customer = {
                        first_name: $scope.customerInfo.first_name,
                        last_name: $scope.customerInfo.last_name,
                        email: $scope.customerInfo.email,
                        mobile_number: $scope.customerInfo.mobile_number,
                        organisation:$scope.customerInfo.organisation
                    };
                    var customerDetails = {
                        "auth_token": $window.sessionStorage['token'],
                        "customer": customer
                    }
                    var url = appSettings.serverPath + appSettings.serviceApis.addcustomer;
                    services.funcPostRequest(url, customerDetails).then(function(response){
                      notify({ classes: 'alert-success', message: response.message });
                    },function(error,status){
                      notify({ classes: 'alert-danger', message: response.message });
                    })
                } else {

                }
            };
        }
    ])

