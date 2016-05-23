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
        '$filter',
        function($scope, $http, appSettings, $window, notify, services,$filter) {
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
                organisation: ''
            }
            $scope.selected = '';
            $scope.noresults = false;
            $scope.loadingcustomers = false;
            $scope.lat = undefined;
            $scope.lng = undefined;
            $scope.trip = {
                    passenger_count:'',
                    pickupdate:'',
                    pickuptime:''
            };

            $scope.options = {
                types: ['(cities)'],
                componentRestrictions: { country: 'FR' }
            };

            $scope.customerId = "";

            $scope.pickup = {
                name: '',
                place: '',
                components: {
                    location: {
                        lat: '',
                        long: ''
                    }
                }
            };
            $scope.dropoff = {
                name: '',
                place: '',
                components: {
                    location: {
                        lat: '',
                        long: ''
                    }
                }
            };


            $scope.getExistingCustomers = function(search_string) {
                var url = appSettings.serverPath + appSettings.serviceApis.getExistingCustomers;
                $scope.loadingcustomers = true;
                return services.funcPostRequest(url, { 'search_string': search_string }).then(function(response) {
                    if (response.data) {
                        $scope.noresults = false;
                        $scope.loadingcustomers = false;
                        var customers = response.data.customers;
                        var results = [];
                        angular.forEach(customers, function(item) {
                            item.full_name = item.first_name + " " + item.last_name;
                            if (item.full_name.toLowerCase().indexOf(search_string.toLowerCase()) > -1) {
                                results.push(item);
                            }
                        });
                        return results;
                    } else {
                        $scope.noresults = true;
                        $scope.loadingcustomers = false;
                        jQuery('#nocustomer').text(response.message);
                    }
                    //notify({ classes: 'alert-success', message: response.message });
                }, function(error) {
                    notify({ classes: 'alert-danger', message: response.message });
                });
            }

            $scope.$on('gmPlacesAutocomplete::placeChanged', function() {
                var location = $scope.autocomplete.getPlace().geometry.location;
                $scope.lat = location.lat();
                $scope.lng = location.lng();
                $scope.$apply();
            });

            $scope.submitForm = function(isValid){

            };
            //typeahead selected object info
            $scope.onSelect = function ($item, $model, $label) {
                        $scope.$item = $item;
                        $scope.customerId = $item.id;
           
            };

            // function to submit the form after all validation has occurred
            $scope.funcAddCustomer = function(isValid) {
                if (isValid) {
                    var customer = {
                        first_name: $scope.customerInfo.first_name,
                        last_name: $scope.customerInfo.last_name,
                        email: $scope.customerInfo.email,
                        mobile_number: $scope.customerInfo.mobile_number,
                        organisation: $scope.customerInfo.organisation
                    };
                    var url = appSettings.serverPath + appSettings.serviceApis.addcustomer;
                    services.funcPostRequest(url, { "customer": customer }).then(function(response) {
                        $scope.customerId = response.data.customer.id;
                        notify({ classes: 'alert-success', message: response.message });
                    }, function(error, status) {
                        if (response)
                            notify({ classes: 'alert-danger', message: response.message });
                    })
                } else {

                }
            };

            $scope.funcMakeTrip = function(isValid) {
                if (isValid) {
                    $scope.trip.pickupdate =  $filter('date')($scope.trip.pickupdate ,'dd/MM/yyyy');
                     $scope.trip.pickuptime =   $filter('date')($scope.trip.pickuptime ,'hh:mm a') ; 
                    var trip = {
                        start_destination: {
                            place: $scope.pickup.name,
                            latitude: $scope.pickup.components.location.lat,
                            longitude: $scope.pickup.components.location.long
                        },
                        end_destination: {
                            place: $scope.dropoff.name,
                            latitude: $scope.dropoff.components.location.lat,
                            longitude: $scope.dropoff.components.location.long
                        },
                        pick_up_at: $scope.trip.pickupdate +","+  $scope.trip.pickuptime ,
                        passengers_count: $scope.trip.passenger_count,
                        customer_id: $scope.customerId
                    };
                    var customerDetails = {
                        "trip": trip
                    }
                    var url = appSettings.serverPath + appSettings.serviceApis.createTrip;
                    services.funcPostRequest(url, customerDetails).then(function(response) {
                            console.log(response);
                        notify({ classes: 'alert-success', message: response.message });
                    }, function(error, status) {
                        if (response)
                            notify({ classes: 'alert-danger', message: response.message });
                    })
                } else {

                }
            }
        }
    ])
    .controller('DatepickerCtrl', function($scope) {

        $scope.today = function() {
            $scope.trip.pickupdate = new Date();
        };

        $scope.today();

        $scope.clear = function() {
            $scope.trip.pickupdate = null;
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            'class': 'datepicker'
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
    })
    .controller('TimepickerCtrl', function($scope) {
        $scope.trip.pickuptime = new Date();

        $scope.hstep = 1;
        $scope.mstep = 15;

        $scope.options = {
            hstep: [1, 2, 3],
            mstep: [1, 5, 10, 15, 25, 30]
        };

        $scope.ismeridian = true;
        $scope.toggleMode = function() {
            $scope.ismeridian = !$scope.ismeridian;
        };

        $scope.update = function() {
            var d = new Date();
            d.setHours(14);
            d.setMinutes(0);
            $scope.trip.pickuptime = d;
        };

        $scope.changed = function() {
            console.log('Time changed to: ' + $scope.trip.pickuptime);
        };

        $scope.clear = function() {
            $scope.trip.pickuptime = null;
        };
    })
