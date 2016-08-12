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
            $scope.emptyCustomGroup = false;
            // $scope.isChoosedAirports = false;
            // $scope.isChoosedAirports1 = false;
            // $scope.pickupOptionSelected = true;
            // $scope.dropoffOptionSelected = true;
            // $scope.isPickupBy = true;
            // $scope.isDropOffBy = true;
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

            // Get existing customers in typeahead
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

            //typeahead selected customer object info
            $scope.onSelectCustomer = function($item, $model, $label) {
                $scope.$item = $item;
                $scope.customerId = $item.id;
                $scope.isChoosed = true;
            };


            // Add customer to make a trip
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

            $scope.isChoosedCustomGroup = false;
            $scope.customgroupdata = [];
            $scope.customgroupModel = [];
            $scope.groupIdArr = [];
            $scope.customgroupsettings = {
                smartButtonMaxItems: 5,
                enableSearch: true,
                scrollableHeight: 'auto',
                scrollable: true,
                showCheckAll: false,
                showUncheckAll: false,
                smartButtonTextConverter: function(itemText, originalItem) {
                    $scope.groupIdArr = [];

                    var val = $scope.customgroupModel
                    if ($scope.customgroupModel.length) {
                        $scope.isChoosedCustomGroup = true;
                    } else {
                        $scope.isChoosedCustomGroup = false;
                    }
                    $.each($scope.customgroupModel, function(key, value) {
                        $scope.groupIdArr.push(value.id)
                            // console.log('groupIds', $scope.groupIdArr)
                    });

                    return itemText;
                }

            };
            console.log('dfsf', $scope.groupIdArr);
            //remove duplicates from array
            function unique(list) {
                var result = [];
                $.each(list, function(i, e) {
                    if ($.inArray(e, result) == -1) result.push(e);
                });
                return result;
            }

            getCustomGroupsList();
            // Get all custom group list
            function getCustomGroupsList() {
                var url = appSettings.serverPath + appSettings.serviceApis.getCustomGroups;
                services.funcPostRequest(url, { "page": '0', "per_page": '0' }).then(function(response) {
                    if(response.data){
                        $scope.groupList = response.data.groups;
                        for (var i = 0; i < $scope.groupList.length; i++) {
                            $scope.groupList[i].label = $scope.groupList[i].name
                        }
                        //$scope.emptyCustomGroup = false;
                        $scope.customgroupdata = $scope.groupList;
                        $scope.customgroupModel = $scope.customgroupdata.length ? [{ id: $scope.customgroupdata[0].id }] : [];
                    }else{
                         //$scope.emptyCustomGroup = true;
                    }
                    
                }, function(error) {
                    notify({ classes: 'alert-danger', message: error });
                });
            }


            //Google Autocomplete to pickup and dropoff inputs
            setTimeout(function() {
                var pickupId = document.getElementById('pickup');
                var dropoffId = document.getElementById('dropoff');
                GetPickUpCoordinates(pickupId);
                GetDropoffCoordinates(dropoffId);
            }, 5000);

            //add google address autocomplete to pickup input on page load
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
            //add google address autocomplete to drop-off input on page load
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



            var locations = [];
            var geocoder;
            var locationsArr = [];
            var count = 0;

            //validate address with google geocoder with multiple addresses
            function validateAddressGeoCoder() {
                // $scope.isTripFormValid = true;
                // $scope.steps.step3 = true;
                count = 0;
                locations = [];
                locationsArr = [];
                $scope.pickupId = jQuery('#pickup').val();
                $scope.dropoffId = jQuery('#dropoff').val();
                locations[0] = $scope.pickupId;
                locations[1] = $scope.dropoffId;
                geocoder = new google.maps.Geocoder();

                for (var i = 0; i < locations.length; i++) {
                    verifyAddress(locations, i);
                }
            }

            function verifyAddress(locations, i) {
                var address = locations[i];
                geocoder.geocode({ 'address': locations[i] }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        var obj = {
                            i: i,
                            address: address,
                            lat: results[0].geometry.location.lat(),
                            lng: results[0].geometry.location.lng()
                        }
                        count++;
                        locationsArr.push(obj);
                        //when both address are valid
                        if (count === 2) {
                            $scope.isTripFormValid = true;
                            $scope.steps.step3 = true;
                            holdTripInfo();
                        }
                    } else {
                        alert(address + " is invalid address:");
                        console.log(address, " is invalid address:");
                        swal({
                            title: "Invalid Address",
                            text: "The address you have entered " + address + " is invalid",
                            type: "error",
                            showCancelButton: false,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "OK",
                            closeOnConfirm: true
                        }, function(isConfirm) {
                            if (!isConfirm) return;
                        });

                        $scope.isTripFormValid = false;
                        $scope.steps.step2 = true;
                        if (i === 0)
                            $scope.pickup_place_valid = false;
                        if (i === 1)
                            $scope.dropoff_place_valid = false;
                    }
                });
            }


            $scope.funcMakeTrip = function(isValid) {
                $scope.pickupId = jQuery('#pickup').val();
                $scope.dropoffId = jQuery('#dropoff').val();
                validateAddressGeoCoder();
            }

            function holdTripInfo() {
                if ($scope.isTripFormValid) {
                    $scope.trip.pickup_date = $filter('date')($scope.trip.pickupdate, 'dd/MM/yyyy');
                    $scope.trip.pickup_time = $filter('date')($scope.trip.pickuptime, 'hh:mm a');
                    //console.log($scope.pickup.name, $scope.pickup.components.location.lat, $scope.pickup.components.location.long);

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
                        customer_id: $scope.customerId,
                        group_ids: $scope.groupIdArr
                    };
                    console.log($scope.tripInfo.pick_up_at);
                    // constants.tripdata = $scope.tripInfo;
                    // constants.tripdata.pickup_date = $scope.trip.pickupdate;
                    // constants.tripdata.pickup_time = $scope.trip.pickuptime;
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


                } else {

                }
            }

            $scope.funcSelectVehicleType = function() {
                var url = appSettings.serverPath + appSettings.serviceApis.selectVehicleType;
                services.funcGetRequest(url).then(function(response) {
                    $scope.vehicleType = response.data.vehicle_types;
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
                var url = appSettings.serverPath + appSettings.serviceApis.tripCreate;
                console.log($scope.tripInfo);
                $scope.tripInfo.vehicle_type_id = $scope.vehicleId;
                var trip = $scope.tripInfo;
                //                 var trip = {
                //                     "id": $scope.tripId,
                //                     "vehicle_type_id": $scope.vehicleId
                //                 }

                services.funcPostRequest(url, { 'trip': trip }).then(function(response) {
                    console.log('resp', response);
                    notify({ classes: 'alert-success', message: response.message });
                    $scope.steps.step0 = true;
                    $scope.steps.step1 = true;
                    $scope.steps.step3 = false;
                }, function(error) {
                    notify({ classes: 'alert-danger', message: response.message });
                })
            }

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


// function getTimeDifference() {
//     var notifiedDate = '2016-07-27T15:13:45.754+05:30';
//     var currentDate = new Date();
//     var utcDate = new Date(notifiedDate)
//     var hourDifference = utcDate.getHours() - currentDate.getHours();
//     var minuteDifference = utcDate.getMinutes() - currentDate.getMinutes();

//     console.log("hours", hourDifference);
//     console.log("Minutes", minuteDifference);
//     if (((hourDifference == 0) && (minuteDifference <= 5)) || ((hourDifference == 1) && (minuteDifference < 5))) {

//     }
// }
