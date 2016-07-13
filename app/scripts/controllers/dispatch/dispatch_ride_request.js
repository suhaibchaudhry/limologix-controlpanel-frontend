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
        '$rootScope',
        '$http',
        'appSettings',
        '$window',
        'notify',
        'services',
        '$filter',
        '$uibModal',
        '$log',
        'countriesConstant',
        'dispatchRideProvider',
        function($scope, $rootScope, $http, appSettings, $window, notify, services, $filter, $uibModal, $log, constants, dispatchRideProvider) {
            $scope.page = {
                title: 'Dispatch Ride Request',
                subtitle: '' //'Place subtitle here...'
            };
            $scope.items = ['item1', 'item2', 'item3'];
            $scope.phoneNumbr = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
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
                passenger_count: '',
                pickupdate: '',
                pickuptime: ''
            };
            $scope.options = {
                types: ['(cities)'],
                componentRestrictions: { country: 'us' }
            };
            $scope.trip_options = {
                types: ['(cities)'],
                componentRestrictions: { country: 'us' }
            };
            $scope.imagePath = appSettings.server_images_path;
            $scope.customerId = "";
            // Google place autocomplete location Object of pick up and drop off
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
            //Boolean which check user has selected customer from typeahead list
            $scope.isChoosed = false;
            $scope.BookNow = false;
            //$scope.vehicleType = [{ "id": 1, "name": "Luxury Sedan", "description": "Hic odit distinctio cum sequi dolores tempore.", "capacity": 9, "image": "/uploads/vehicle_type/image/1/dummy_image_9.png" }, { "id": 2, "name": "Economy Sedan", "description": "Optio sed et veniam eum.", "capacity": 7, "image": "/uploads/vehicle_type/image/2/dummy_image_7.png" }]

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
                        $scope.isChoosed = false;
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

            //typeahead selected object info
            $scope.onSelect = function($item, $model, $label) {
                $scope.$item = $item;
                $scope.customerId = $item.id;
                $scope.isChoosed = true;
            };

            //Get customer Id from search existing customer typeahead
            $scope.funcGetSearchedCustomerId = function(isValid) {

            };

            // function to submit the form after all validation has occurred
            $scope.funcAddCustomer = function(isValid) {
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
            };

            $scope.funcMakeTrip = function(isValid) {
                if (isValid) {
                    $scope.trip.pickup_date = $filter('date')($scope.trip.pickupdate, 'dd/MM/yyyy');
                    $scope.trip.pickup_time = $filter('date')($scope.trip.pickuptime, 'hh:mm a');
                    $scope.tripInfo = {
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
                        pick_up_at: $scope.trip.pickup_date + "," + $scope.trip.pickup_time,
                        passengers_count: $scope.trip.passenger_count,
                        customer_id: $scope.customerId
                    };
                    constants.tripdata = $scope.tripInfo;
                    constants.tripdata.pickup_date = $scope.trip.pickupdate;
                    constants.tripdata.pickup_time = $scope.trip.pickuptime;
                    var customerDetails = {
                        "trip": $scope.tripInfo
                    }
                    var url = appSettings.serverPath + appSettings.serviceApis.createTrip;
                    services.funcPostRequest(url, customerDetails).then(function(response) {
                        console.log(response);
                        $scope.tripId = response.data.trip.id;
                        constants.tripdata.tripId = $scope.tripId;
                        notify({ classes: 'alert-success', message: response.message });
                        $scope.funcGetTripSummary($scope.tripId);
                    }, function(error, status) {
                        if (response)
                            notify({ classes: 'alert-danger', message: response.message });
                    })
                } else {

                }
            }

            $scope.funcGetTripSummary = function(tripId) {
                var url = appSettings.serverPath + appSettings.serviceApis.tripSummary;
                services.funcPostRequest(url, { "trip_id": tripId }).then(function(response) {
                    $scope.tripsummary = {
                        pickupdatetime: response.data.trip.pick_up_at,
                        pickupAt: response.data.trip.start_destination.place,
                        dropoffAt: response.data.trip.end_destination.place
                    }
                    dispatchRideProvider.getRoutes($scope.tripsummary.pickupAt, $scope.tripsummary.dropoffAt,notify);
                    $scope.funcSelectVehicleType();
                    // notify({ classes: 'alert-success', message: response.message });
                }, function(error, status) {
                    if (response)
                        notify({ classes: 'alert-danger', message: response.message });
                })
            };
            //update trip summary model values
            $rootScope.$on('updateTrip', function(e, tripsummary) {
                $scope.tripsummary = tripsummary;
            });

            $scope.funcSelectVehicleType = function() {
                var url = appSettings.serverPath + appSettings.serviceApis.selectVehicleType;
                services.funcGetRequest(url).then(function(response) {
                    $scope.vehicleType = response.data.vehicle_types;

                    // notify({ classes: 'alert-success', message: response.message });
                }, function(error, status) {
                    if (response)
                        notify({ classes: 'alert-danger', message: response.message });
                })
            };
            $scope.bookVehicle = function(element) {
                angular.forEach($scope.vehicleType, function(elem) {
                    elem.active = false;
                });
                $scope.BookNow = true;
                element.active = !element.active;
            }
            $scope.editTripModalOpen = function(size) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'myModalContent.html',
                    controller: 'TripEditModalCtrl',
                    size: size,
                    resolve: {
                        items: function() {
                            return $scope.items;
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    $scope.selected = selectedItem;
                }, function() {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            }
        }
    ])

.controller('TripEditModalCtrl', [
        '$scope',
        '$rootScope',
        '$uibModalInstance',
        '$filter',
        '$http',
        '$window',
        'appSettings',
        'notify',
        'services',
        'countriesConstant',
        'dispatchRideProvider',
        function($scope, $rootScope, $uibModalInstance, $filter, $http, $window, appSettings, notify, services, constants, dispatchRideProvider) {
            $scope.tripinfo = constants.tripdata;
            //display pickup and drop off location info in modal
            $scope.pickup = {
                name: $scope.tripinfo.start_destination.place,
                components: {
                    location: {
                        lat: $scope.tripinfo.start_destination.latitude,
                        long: $scope.tripinfo.start_destination.longitude
                    }
                }
            };
            $scope.dropoff = {
                name: $scope.tripinfo.end_destination.place,

                components: {
                    location: {
                        lat: $scope.tripinfo.end_destination.latitude,
                        long: $scope.tripinfo.end_destination.longitude
                    }
                }
            };

            $scope.funcEditTrip = function(isValid) {
                //updated pickup and drop off location info
                $scope.editTrip = {};
                $scope.editTrip.pickup_date = $filter('date')($scope.tripinfo.pickup_date, 'dd/MM/yyyy');
                $scope.editTrip.pickup_time = $filter('date')($scope.tripinfo.pickup_time, 'hh:mm a');
                $scope.tripData = {
                    id: constants.tripdata.tripId,
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
                    pick_up_at: $scope.editTrip.pickup_date + "," + $scope.editTrip.pickup_time,
                    passengers_count: $scope.tripinfo.passengers_count

                }
                $scope.pickup = {
                    name: $scope.tripData.start_destination.place,
                    components: {
                        location: {
                            lat: $scope.tripData.start_destination.latitude,
                            long: $scope.tripData.start_destination.longitude
                        }
                    }
                };
                $scope.dropoff = {
                    name: $scope.tripData.end_destination.place,

                    components: {
                        location: {
                            lat: $scope.tripData.end_destination.latitude,
                            long: $scope.tripData.end_destination.longitude
                        }
                    }
                };

                var url = appSettings.serverPath + appSettings.serviceApis.tripUpdate;
                services.funcPostRequest(url, { "trip": $scope.tripData }).then(function(response) {
                    $scope.tripId = response.data.trip.id;
                    notify({ classes: 'alert-success', message: response.message });
                    $scope.funcUpdateTripSummary($scope.tripId);
                    $uibModalInstance.close();
                }, function(error, status) {
                    if (response)
                        notify({ classes: 'alert-danger', message: response.message });
                })
            }

            $scope.funcUpdateTripSummary = function(tripId) {
                var url = appSettings.serverPath + appSettings.serviceApis.tripSummary;
                services.funcPostRequest(url, { "trip_id": tripId }).then(function(response) {
                    $scope.tripsummary = {
                        pickupdatetime: response.data.trip.pick_up_at,
                        pickupAt: response.data.trip.start_destination.place,
                        dropoffAt: response.data.trip.end_destination.place
                    }
                    $rootScope.$emit('updateTrip', $scope.tripsummary)
                    dispatchRideProvider.getRoutes($scope.tripsummary.pickupAt, $scope.tripsummary.dropoffAt);
                }, function(error, status) {
                    if (response)
                        notify({ classes: 'alert-danger', message: response.message });
                })
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };
        }
    ])
    .controller('DatepickerTripCtrl', ['$scope', 'countriesConstant', function($scope, constants) {
        $scope.today = function() {
            //make a trip datepicker
            if ($scope.trip)
                $scope.trip.pickupdate = new Date();
            //update trip datepicker
            if ($scope.tripinfo)
                $scope.tripinfo.pickup_date = constants.tripdata.pickup_date; //new Date('2011-09-19T19:49:21+04:00');
        };

        $scope.today();

        $scope.clear = function() {
            $scope.tripinfo.pickup_date = null;
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
    }])

.controller('TimepickerCtrl', ['$scope', 'countriesConstant', function($scope, constants) {
    if ($scope.trip)
        $scope.trip.pickuptime = new Date();
    if ($scope.tripinfo)
        $scope.tripinfo.pickup_time = constants.tripdata.pickup_time; //new Date();

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
        if ($scope.trip)
            $scope.trip.pickuptime = d;
        if ($scope.tripinfo)
            $scope.tripinfo.pickup_time = d;
    };

    $scope.changed = function() {
        //console.log('Time changed to: ' + $scope.tripinfo.pickup_time);
    };

    $scope.clear = function() {
        if ($scope.trip)
            $scope.trip.pickuptime = null;
        if ($scope.tripinfo)
            $scope.tripinfo.pickup_time = null;
    };
}])
