'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:DispatchRideRequestNewCtrl
 * @description
 * # DispatchRideRequestNewCtrl
 * Controller of the limoLogixApp
 */
app
    .controller('DispatchRideRequestNewCtrl', [
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

            $scope.steps = { step0: true, step1: true, step2: false, step3: false, step4: false, step5: false }

            $scope.items = ['item1', 'item2', 'item3'];
            $scope.phoneNumbr = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
            $scope.customerInfo = {
                first_name: '',
                last_name: '',
                email: '',
                mobile_number: '',
                organisation: ''
            }

            var arr = []; 
            $scope.isTripFormValid = false;
            $scope.pickup_place_invalid_msg = false;
            $scope.dropoff_place_invalid_msg = false;
            $scope.pickup_place_valid = false;
            $scope.dropoff_place_valid = false;
            $scope.imagePath = appSettings.server_images_path;

            $scope.selected = '';
            $scope.noresults = false;
            $scope.loadingcustomers = false;
            $scope.isChoosedAirports = false;
            $scope.isChoosedAirports1 = false;
            $scope.pickupOptionSelected = true;
            $scope.dropoffOptionSelected = true;
            $scope.isPickupBy = true;
            $scope.isDropOffBy = true;
            $scope.lat = undefined;
            $scope.lng = undefined;
            $scope.trip = {
                passenger_count: '',
                pickupdate: '',
                pickuptime: ''
            };
            $scope.options = {
                // types: ['geocode'],
                componentRestrictions: { country: 'us' }
            };

            $scope.trip_options = {
                types: ['(cities)'],
                componentRestrictions: { country: 'us' }
            };
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

            setTimeout(function() {
                var pickupId = document.getElementById('pickup');
                var dropoffId = document.getElementById('dropoff');
                GetPickUpCoordinates(pickupId);
                GetDropoffCoordinates(dropoffId);
            }, 5000);

            

            function GetPickUpCoordinates(id) {
                var places = new google.maps.places.Autocomplete(id, $scope.options);
                google.maps.event.addListener(places, 'place_changed', function() {
                    var place = places.getPlace();
                    var address = place.formatted_address;
                    var geocoder = new google.maps.Geocoder();
                    $scope.address = address;

                    geocoder.geocode({ 'address': $scope.address }, function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            $scope.pickup_place_valid = true;
                            //  $scope.pickup_place_invalid_msg = false;
                            $scope.pickup_place = $scope.address;
                            $scope.pickup_latitude = results[0].geometry.location.lat();
                            $scope.pickup_longitude = results[0].geometry.location.lng();
                            //console.log('pickup',$scope.address,latitude,longitude);
                        } else {
                            alert('invalid pickup address');
                            // $scope.pickup_place_invalid_msg = true;
                            $scope.pickup_place_valid = false;
                        }
                    });
                });
            }

            function GetDropoffCoordinates(id) {
                var places = new google.maps.places.Autocomplete(id, $scope.options);
                google.maps.event.addListener(places, 'place_changed', function() {
                    var place = places.getPlace();
                    var address = place.formatted_address;
                    var geocoder = new google.maps.Geocoder();

                    $scope.address = address;
                    geocoder.geocode({ 'address': $scope.address }, function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            $scope.dropoff_place_valid = true;
                            $scope.dropoff_place_invalid_msg = false;
                            $scope.dropoff_place = $scope.address;
                            $scope.dropoff_latitude = results[0].geometry.location.lat();
                            $scope.dropoff_longitude = results[0].geometry.location.lng();
                            //console.log('pickup',$scope.address,latitude,longitude);
                        } else {
                            alert('invalid dropoff address');
                            $scope.dropoff_place_valid = false;
                            $scope.dropoff_place_invalid_msg = true;
                        }
                    });
                });
            }




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
                alert("hh");
                var location = $scope.autocomplete.getPlace().geometry.location;
                $scope.lat = location.lat();
                $scope.lng = location.lng();
                $scope.$apply();
                console.log("hiiiii");
            });
            $scope.funcGetPickUpLocality = function() {
                $("#pickup_airport").val('');
                $scope.isChoosedAirports = true;
                //alert("hi")

            }

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

            // $scope.isPickupByLocation = function() {
            //     //$("#pickup_airport").val('');
            //     $scope.airport_name = ''
            //     $scope.isPickupBy = true;
            //     $scope.pickupOptionSelected = true;
            // }
            // $scope.isPickupByAirport = function() {
            //     // $("#pickup").val('');

            //     $scope.isPickupBy = false;
            //     $scope.pickupOptionSelected = false;

            // }
            // $scope.isDropOffByLocation = function() {
            //     $scope.isDropOffBy = true;
            //     $scope.dropoffOptionSelected = true;
            // }
            // $scope.isDropOffByAirport = function() {
            //     $scope.isDropOffBy = false;
            //     $scope.dropoffOptionSelected = false;
            // }
            // $scope.getAirports = function(search_string) {
            //     return $http.get('scripts/jsons/usa_airports.json').then(function(response) {
            //         if (response.data) {
            //             $scope.no_airport_results = false;
            //             $scope.loadingcustomers = false;
            //             $scope.airports = response.data;
            //             var results = [];
            //             angular.forEach($scope.airports, function(item) {
            //                 item.airport_name = item.airport_name;
            //                 if (item.airport_name.toLowerCase().indexOf(search_string.toLowerCase()) > -1) {
            //                     $scope.no_airport_results = false;

            //                     results.push(item);
            //                 } else {
            //                     $scope.no_airport_results = true;
            //                     $scope.isChoosedAirports = false;
            //                     jQuery('#noairports').text('No matched airports');
            //                 }
            //             });
            //             return results;
            //         }

            //     });
            // }
            // $scope.getAirports1 = function(search_string) {
            //         return $http.get('scripts/jsons/usa_airports.json').then(function(response) {
            //             if (response.data) {
            //                 $scope.no_airport_results1 = false;
            //                 $scope.loadingcustomers = false;
            //                 var airports = response.data;
            //                 var results = [];
            //                 angular.forEach(airports, function(item) {
            //                     item.airport_name = item.airport_name;
            //                     if (item.airport_name.toLowerCase().indexOf(search_string.toLowerCase()) > -1) {
            //                         results.push(item);
            //                     }
            //                 });
            //                 return results;
            //             } else {
            //                 $scope.no_airport_results1 = true;
            //                 $scope.isChoosedAirports1 = false;
            //                 jQuery('#noairports1').text('No matched airports');
            //             }

            //         });
            //     }
            //     //typeahead selected object info
            // $scope.onSelectAirport = function(item) {
            //     $scope.isChoosedAirports = true;
            //     $scope.no_airport_results = false;
            //     // $scope.$item = $item;
            //     // $scope.pickup_airport_place = $item.airport_name;
            //     // $scope.pickup_airport_latitude = $item.latitude;
            //     // $scope.pickup_airport_longitude = $item.longitude;

            //     // $scope.pickup.name = $item.airport_name;
            //     // $scope.pickup.components.location.lat = $item.latitude;
            //     // $scope.pickup.components.location.long = $item.longitude;
            //     // $scope.isChoosedAirports = true;
            //     // $scope.pickup.name = null;
            // };

            // //typeahead selected object info
            // $scope.onSelectAirport1 = function($item, $model, $label) {
            //     $scope.$item = $item;
            //     $scope.dropoff_airport_place = $item.airport_name;
            //     $scope.dropoff_airport_latitude = $item.latitude;
            //     $scope.dropoff_airport_longitude = $item.longitude;
            //     $scope.isChoosedAirports1 = true;
            // };
            function geocodeAddress(geocoder,locations, i) {

                // var geocoder1 = new google.maps.Geocoder();
                //$scope.address0 = locations[0];
                //$scope.address1 = locations[1];
                var address =  locations[i];
                
                var obj = {};
                geocoder.geocode({ 'address': locations[i] }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        console.log(address,results[0].geometry.location.lat(),results[0].geometry.location.lng());
                          
                            arr.push(results[0]);
                            console.log('hello',arr);


                            // var pickupinfo = {
                            //     "val" : i
                            // };
                            // return pickupinfo ;

                            // $scope.dropoff_place = $scope.address1;
                            // $scope.dropoff_latitude = results[0].geometry.location.lat();
                            // $scope.dropoff_longitude = results[0].geometry.location.lng();


                        // if (i === 0) {
                        //     $scope.pickup_place_valid = true;
                        //     // $scope.pickup_place_invalid_msg = false;
                        //     $scope.pickup_place = $scope.address0;
                        //     $scope.pickup_latitude = results[0].geometry.location.lat();
                        //     $scope.pickup_longitude = results[0].geometry.location.lng();
                        //     return;
                        // }
                        // if(i===1) {
                        //     $scope.dropoff_place_valid = true;
                        //     //$scope.dropoff_place_invalid_msg = false;
                        //     $scope.dropoff_place = $scope.address1;
                        //     $scope.dropoff_latitude = results[0].geometry.location.lat();
                        //     $scope.dropoff_longitude = results[0].geometry.location.lng();
                        //     return;
                        // }

                    } 
                    // else {
                    //     if (i === 0) {
                    //         alert('invalid pickup address');
                    //         $scope.pickup_place_valid = false;
                    //         return;
                    //         //$scope.pickup_place_invalid_msg = true;
                    //     }
                    //     if(i===1){
                    //         alert('invalid dropoff address');
                    //         $scope.dropoff_place_valid = false;
                    //         return;
                    //         //$scope.pickup_place_invalid_msg = true;
                    //     }

                    // }
                })
            }
            // function invalidDropoffAddress(place2,geocoder) {
            //     //var geocoder2 = new google.maps.Geocoder();
            //     $scope.dropoff_address = place2;

            //         geocoder.geocode({ 'address': $scope.dropoff_address }, function(results, status) {
            //             if (status == google.maps.GeocoderStatus.OK) {
            //                 $scope.dropoff_place_valid = true;
            //                  $scope.dropoff_place_invalid_msg = false;
            //                 $scope.dropoff_place = $scope.dropoff_address;
            //                 $scope.dropoff_latitude = results[0].geometry.location.lat();
            //                 $scope.dropoff_longitude = results[0].geometry.location.lng();
            //             } else {
            //                 alert('invalid dropoff address');
            //                 $scope.dropoff_place_valid = false;
            //                 $scope.dropoff_place_invalid_msg = true;
            //             }
            //         });

            // }

            $scope.funcMakeTrip = function(isValid) {
                var pickupId = jQuery('#pickup').val();
                var dropoffId = jQuery('#dropoff').val();
                var geocoder = new google.maps.Geocoder();

                var locations = [];
                locations[0] = pickupId;
                locations[1] = dropoffId;
                arr = [];
                for (var i = 0; i < locations.length; i++) {
                    geocodeAddress(geocoder,locations, i);
                    

                    //arr.push(geocodeAddress(geocoder,locations, i));
                    //console.log('dsfsf',arr);

                }

                //invalidPickupAddress(pickupId, geocoder);
                //invalidDropoffAddress(dropoffId,geocoder);

                if (isValid && $scope.pickup_place_valid && $scope.dropoff_place_valid) {
                    $scope.isTripFormValid = true;
                    $scope.steps.step3 = true;
                    $scope.trip.pickup_date = $filter('date')($scope.trip.pickupdate, 'dd/MM/yyyy');

                    $scope.trip.pickup_time = $filter('date')($scope.trip.pickuptime, 'hh:mm a');
                    console.log($scope.pickup.name, $scope.pickup.components.location.lat, $scope.pickup.components.location.long);

                    $scope.tripInfo = {
                        start_destination: {
                            place: $scope.pickup_place,
                            latitude: $scope.pickup_latitude,
                            longitude: $scope.pickup_longitude
                        },
                        end_destination: {
                            place: $scope.dropoff_place,
                            latitude: $scope.dropoff_latitude,
                            longitude: $scope.dropoff_longitude
                        },
                        pick_up_at: $scope.trip.pickup_date + "," + $scope.trip.pickup_time,
                        passengers_count: $scope.trip.passenger_count,
                        customer_id: $scope.customerId
                    };
                    console.log($scope.tripInfo.pick_up_at);
                    constants.tripdata = $scope.tripInfo;
                    constants.tripdata.pickup_date = $scope.trip.pickupdate;
                    constants.tripdata.pickup_time = $scope.trip.pickuptime;
                    var customerDetails = {
                        "trip": $scope.tripInfo
                    }


                    $scope.tripsummary = {
                        pickupdatetime: $scope.tripInfo.pick_up_at,
                        pickupAt: $scope.tripInfo.start_destination.place,
                        dropoffAt: $scope.tripInfo.end_destination.place
                    }
                    dispatchRideProvider.getRoutes($scope.tripsummary.pickupAt, $scope.tripsummary.dropoffAt, notify);
                    $scope.funcSelectVehicleType();


                    // var url = appSettings.serverPath + appSettings.serviceApis.createTrip;
                    // services.funcPostRequest(url, customerDetails).then(function(response) {
                    //     console.log(response);
                    //     $scope.tripId = response.data.trip.id;
                    //     constants.tripdata.tripId = $scope.tripId;
                    //     notify({ classes: 'alert-success', message: response.message });
                    //     $scope.funcGetTripSummary($scope.tripId);
                    // }, function(error, status) {
                    //     if (response)
                    //         notify({ classes: 'alert-danger', message: response.message });
                    // })
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
                    dispatchRideProvider.getRoutes($scope.tripsummary.pickupAt, $scope.tripsummary.dropoffAt, notify);
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
                    console.log("vehicleType", $scope.vehicleType);
                    // notify({ classes: 'alert-success', message: response.message });
                }, function(error, status) {
                    if (response)
                        notify({ classes: 'alert-danger', message: response.message });
                })
            };
            $scope.bookVehicle = function(element) {
                $scope.vehicleId = element.id;
                angular.forEach($scope.vehicleType, function(elem) {
                    elem.active = false;
                });
                $scope.BookNow = true;
                element.active = !element.active;
            }
            $scope.funcTripDispatch = function() {
                var url = appSettings.serverPath + appSettings.serviceApis.tripDispatch;
                var trip = {
                    "id": $scope.tripId,
                    "vehicle_type_id": $scope.vehicleId
                }

                services.funcPostRequest(url, { 'trip': trip }).then(function(response) {
                    console.log('resp', response);
                    notify({ classes: 'alert-success', message: response.message });
                }, function(error) {
                    notify({ classes: 'alert-danger', message: response.message });
                })
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
    //$scope.trip.pickuptime = new Date();
        var date = new Date();
    $scope.trip.pickuptime = date.toUTCString();
    console.log("utc Time", $scope.trip.pickuptime);
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
