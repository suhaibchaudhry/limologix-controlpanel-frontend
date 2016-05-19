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
        function($scope, $http, appSettings, $window, notify) {
            $scope.page = {
                title: 'Dispatch Ride Request',
                subtitle: '' //'Place subtitle here...'
            };
            $scope.mobile_number = /^\+?\d{1}[- ]?\d{3}[- ]?\d{3}[- ]?\d{4}$/;
            $scope.customerInfo = {
                first_name: '',
                last_name: '',
                email: '',
                mobile_number: ''
            }
            
            $scope.airplanes = [{
                "registration": "C-FNND",
                "operator": "Air Canada",
                "manufacturer": "Boeing",
                "type": "777-200"
            }, {
                "registration": "PH-BFW",
                "operator": "KLM Royal Dutch Airlines",
                "manufacturer": "Boeing",
                "type": "747-400"
            }, {
                "registration": "N124US",
                "operator": "US Airways",
                "manufacturer": "Airbus",
                "type": "A320-200"
            }, {
                "registration": "A6-EEU",
                "operator": "Emirates",
                "manufacturer": "Airbus",
                "type": "A380-800"
            }, {
                "registration": "VH-LQL",
                "operator": "Qantas",
                "manufacturer": "Bombardier",
                "type": "DHC-8-400"
            }]
            console.log('sdf', $scope.airplanes);
            $scope.getExistingCustomers = function() {
                var url = appSettings.serverPath + appSettings.serviceApis.getExistingCustomers;
                $http.post(url, { 'auth_token': $window.sessionStorage['token'] }).success(function(response) {
                        notify({ classes: 'alert-success', message: response.message });
                    })
                    .error(function(response, status) {
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
                        mobile_number: $scope.customerInfo.mobile_number
                    };
                    var customerDetails = {
                        "auth_token": $window.sessionStorage['token'],
                        "customer": customer
                    }
                    var url = appSettings.serverPath + appSettings.serviceApis.addcustomer;
                    $http.post(url, customerDetails).success(function(response) {
                            notify({ classes: 'alert-success', message: response.message });
                        })
                        .error(function(response, status) {
                            notify({ classes: 'alert-danger', message: response.message });
                        });
                } else {

                }
            };
        }
    ]);
