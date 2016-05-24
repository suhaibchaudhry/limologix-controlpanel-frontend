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
        function($scope, $http, appSettings, $window, notify, services, $filter) {
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
                passenger_count: '',
                pickupdate: '',
                pickuptime: ''
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
            $scope.isChoosed = false;


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
                    $scope.trip.pickuptime = $filter('date')($scope.trip.pickuptime, 'hh:mm a');
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
                        pick_up_at: $scope.trip.pickup_date + "," + $scope.trip.pickuptime,
                        passengers_count: $scope.trip.passenger_count,
                        customer_id: $scope.customerId ? $scope.customerId : 8
                    };
                    var customerDetails = {
                        "trip": trip
                    }
                    var url = appSettings.serverPath + appSettings.serviceApis.createTrip;
                    services.funcPostRequest(url, customerDetails).then(function(response) {
                        console.log(response);
                        $scope.tripId = response.data.trip.id;
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
                        // notify({ classes: 'alert-success', message: response.message });
                }, function(error, status) {
                    if (response)
                        notify({ classes: 'alert-danger', message: response.message });
                })

            };
        }
    ])
    .controller('DatepickerCtrl', function ($scope) {

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
    .controller('TimepickerCtrl', function ($scope) {
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
    .controller('tripMapCtrl',function ($scope) {
        var source, destination;
        var directionsDisplay;
        var directionsService = new google.maps.DirectionsService();
        //google.maps.event.addDomListener(window, 'load', function() {
            new google.maps.places.SearchBox(document.getElementById('txtSource'));
            new google.maps.places.SearchBox(document.getElementById('txtDestination'));
            directionsDisplay = new google.maps.DirectionsRenderer({ 'draggable': true });
       //});
       // GetRoute();


         $scope.hello = function(){
                 var str = "ffdf";
                 console.log(str);
         };
         $scope.GetRoute= function() {
            var mumbai = new google.maps.LatLng(18.9750, 72.8258);
            var mapOptions = {
                zoom: 7,
                center: mumbai
            };
            var map = new google.maps.Map(document.getElementById('dvMap'), mapOptions);
            directionsDisplay.setMap(map);
            directionsDisplay.setPanel(document.getElementById('dvPanel'));

            //*********DIRECTIONS AND ROUTE**********************//
            source = document.getElementById("txtSource").value;
            destination = document.getElementById("txtDestination").value;

            var request = {
                origin: source,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING
            };
            directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                }
            });

            //*********DISTANCE AND DURATION**********************//
            var service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix({
                origins: [source],
                destinations: [destination],
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC,
                avoidHighways: false,
                avoidTolls: false
            }, function(response, status) {
                if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
                    var distance = response.rows[0].elements[0].distance.text;
                    var duration = response.rows[0].elements[0].duration.text;
                    var dvDistance = document.getElementById("dvDistance");
                    dvDistance.innerHTML = "";
                    dvDistance.innerHTML += "Distance: " + distance + "<br />";
                    dvDistance.innerHTML += "Duration:" + duration;

                } else {
                    alert("Unable to find the distance via road.");
                }
            });
        }
    });
