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
		'$state',
		'$stateParams',
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
		function($scope, $state, $stateParams, $rootScope, $http, appSettings, $window, notify, services, $filter, $uibModal, $log, constants, dispatchRideProvider) {
			$scope.page = {
				title: 'Dispatch trip',
				subtitle: '' //'Place subtitle here...'
			};
			$scope.myDecimal = 0;


			$scope.steps = { step0: false, step1: false, step2: true, step3: false, step4: false, step5: false }

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
			$scope.lat = undefined;
			$scope.lng = undefined;

			$scope.IssourceplaceChange = false;
			$scope.IsdestinationplaceChange = false;

			$scope.trip = {
				passenger_count: '',
				pickupdate: '',
				pickuptime: ''
			};
			$scope.options = {
				// types: ['geocode'],
				componentRestrictions: { country: 'in' }
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
			initMap();

			function initMap() {
				var map = new google.maps.Map(document.getElementById('dvMap'), {
					center: { lat: 29.7630556, lng: -95.3630556 },
					zoom: 13
				});
				var directionsService = new google.maps.DirectionsService;
				var directionsDisplay = new google.maps.DirectionsRenderer;
				directionsDisplay.setMap(map);
				var origin_place_id = null;
				var destination_place_id = null;
				var travel_mode = 'DRIVING';
				var source_input = /** @type {!HTMLInputElement} */ (
					document.getElementById('source-input'));
				var destination_input = /** @type {!HTMLInputElement} */ (
					document.getElementById('destination-input'));



				var source_autocomplete = new google.maps.places.Autocomplete(source_input);
				source_autocomplete.bindTo('bounds', map);

				var destination_autocomplete = new google.maps.places.Autocomplete(destination_input);
				destination_autocomplete.bindTo('bounds', map);

				var source_infowindow = new google.maps.InfoWindow();
				var source_marker = new google.maps.Marker({
					map: map,
					anchorPoint: new google.maps.Point(0, -29)
				});

				var destination_infowindow = new google.maps.InfoWindow();
				var destination_marker = new google.maps.Marker({
					map: map,
					anchorPoint: new google.maps.Point(0, -29)
				});


				source_autocomplete.addListener('place_changed', function() {
					//infowindow.close();
					// marker.setVisible(false);
					var place = source_autocomplete.getPlace();
					$scope.source_place = {
						place_id: place.place_id
					}
					if (!place.geometry) {
						window.alert("Autocomplete's returned place contains no geometry");
						return;
					}

					$scope.IssourceplaceChange = true;


					$scope.pickup_place = document.getElementById('source-input').value;
					$scope.pickup_latitude = place.geometry.location.lat();
					$scope.pickup_longitude = place.geometry.location.lng();
					$scope.pickup_place_id = place.place_id;

					origin_place_id = place.place_id;
					route(origin_place_id, destination_place_id, travel_mode,
						directionsService, directionsDisplay);

					// If the place has a geometry, then present it on a map.
					if (place.geometry.viewport) {
						map.fitBounds(place.geometry.viewport);
					} else {
						map.setCenter(place.geometry.location);
						map.setZoom(17); // Why 17? Because it looks good.
					}
					source_marker.setIcon( /** @type {google.maps.Icon} */ ({
						url: place.icon,
						size: new google.maps.Size(71, 71),
						origin: new google.maps.Point(0, 0),
						anchor: new google.maps.Point(17, 34),
						scaledSize: new google.maps.Size(35, 35)
					}));
					source_marker.setPosition(place.geometry.location);
					source_marker.setVisible(true);

					var address = '';
					if (place.address_components) {
						address = [
							(place.address_components[0] && place.address_components[0].short_name || ''),
							(place.address_components[1] && place.address_components[1].short_name || ''),
							(place.address_components[2] && place.address_components[2].short_name || '')
						].join(' ');
					}

					source_infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address + '</div>');
					source_infowindow.open(map, source_marker);
					google.maps.event.addListener(source_marker, 'click', function() {
						source_infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
							address + '</div>');
						source_infowindow.open(map, source_marker);
					});
				});

				destination_autocomplete.addListener('place_changed', function() {
					//infowindow2.close();
					// marker2.setVisible(false);
					var place = destination_autocomplete.getPlace();
					$scope.destination_place = {
						place_id: place.place_id
					}
					if (!place.geometry) {
						window.alert("Autocomplete's returned place contains no geometry");
						return;
					}

					$scope.IsdestinationplaceChange = true;

					$scope.dropoff_place = document.getElementById('destination-input').value;
					$scope.dropoff_latitude = place.geometry.location.lat();
					$scope.dropoff_longitude = place.geometry.location.lng();
					$scope.dropoff_place_id = place.place_id;


					destination_place_id = place.place_id;
					route(origin_place_id, destination_place_id, travel_mode,
						directionsService, directionsDisplay);

					// If the place has a geometry, then present it on a map.
					if (place.geometry.viewport) {
						map.fitBounds(place.geometry.viewport);
					} else {
						map.setCenter(place.geometry.location);
						map.setZoom(17); // Why 17? Because it looks good.
					}
					destination_marker.setIcon( /** @type {google.maps.Icon} */ ({
						url: place.icon,
						size: new google.maps.Size(71, 71),
						origin: new google.maps.Point(0, 0),
						anchor: new google.maps.Point(17, 34),
						scaledSize: new google.maps.Size(35, 35)
					}));
					destination_marker.setPosition(place.geometry.location);
					// destination_marker.setVisible(true);

					var address = '';
					if (place.address_components) {
						address = [
							(place.address_components[0] && place.address_components[0].short_name || ''),
							(place.address_components[1] && place.address_components[1].short_name || ''),
							(place.address_components[2] && place.address_components[2].short_name || '')
						].join(' ');
					}

					destination_infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
					destination_infowindow.open(map, destination_marker);
					google.maps.event.addListener(destination_marker, 'click', function() {
						destination_infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
							address + '</div>');
						destination_infowindow.open(map, destination_marker);
					});

				});

				function route(origin_place_id, destination_place_id, travel_mode,
					directionsService, directionsDisplay) {
					if (!origin_place_id || !destination_place_id) {
						return;
					}
					directionsService.route({
						origin: { 'placeId': origin_place_id },
						destination: { 'placeId': destination_place_id },
						travelMode: travel_mode
					}, function(response, status) {
						var icons = {
							start: new google.maps.MarkerImage(
								'images/source_marker.png',
								new google.maps.Size(44, 32), //width,height
								new google.maps.Point(0, 0), // The origin point (x,y)
								new google.maps.Point(22, 32)),
							end: new google.maps.MarkerImage(
								'images/destination_marker.png',
								new google.maps.Size(44, 32),
								new google.maps.Point(0, 0),
								new google.maps.Point(22, 32))
						};
						if (status === 'OK') {
							directionsDisplay.setDirections(response);
						} else {
							window.alert('Directions request failed due to ' + status);
						}
					});
				}

			}



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
			//console.log('dfsf', $scope.groupIdArr);
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
					if (response.data) {
						$scope.groupList = response.data.groups;
						for (var i = 0; i < $scope.groupList.length; i++) {
							$scope.groupList[i].label = $scope.groupList[i].name
						}
						$scope.emptyCustomGroup = false;
						$scope.customgroupdata = $scope.groupList;
						$scope.customgroupModel = $scope.customgroupdata.length ? [{ id: $scope.customgroupdata[0].id }] : [];
					} else {
						$scope.emptyCustomGroup = true;
					}

				}, function(error) {
					notify({ classes: 'alert-danger', message: error });
				});
			}




			var locations = [];
			var geocoder;
			var locationsArr = [];
			var count = 0;

			//validate address with google geocoder with multiple addresses
			function validateAddressGeoCoder() {
				count = 0;
				locations = [];
				locationsArr = [];
				$scope.pickupId = jQuery('#source-input').val();
				$scope.dropoffId = jQuery('#destination-input').val();
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

			funcSelectVehicleType();

			function holdTripInfo() {
				if ($scope.isTripFormValid) {
					$scope.trip.pickup_date = $filter('date')($scope.trip.pickupdate, 'dd/MM/yyyy');
					$scope.trip.pickup_time = $filter('date')(new Date(($scope.trip.pickuptime)).toUTCString(), 'hh:mm a');

					$scope.tripInfo = {
						first_name: $scope.customerInfo.first_name,
						last_name: $scope.customerInfo.last_name,
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
						//customer_id: $scope.customerId,
						group_ids: $scope.groupIdArr,
						source_place: $scope.source_place,
						destination_place: $scope.destination_place
					};


					var customerDetails = {
						"trip": $scope.tripInfo
					}

					$scope.tripsummary = {
							pickupdatetime: $scope.tripInfo.pick_up_at,
							pickupAt: $scope.tripInfo.start_destination.place,
							dropoffAt: $scope.tripInfo.end_destination.place
						}
						//dispatchRideProvider.getRoutes($scope.tripsummary.pickupAt, $scope.tripsummary.dropoffAt, notify);
				} else {

				}
			}

			//Get all vehicle types
			function funcSelectVehicleType() {
				var url = appSettings.serverPath + appSettings.serviceApis.selectVehicleType;
				services.funcGetRequest(url).then(function(response) {
					$scope.vehicleType = response.data.vehicle_types;
				}, function(error, status) {
					if (response)
						notify({ classes: 'alert-danger', message: response.message });
				})
			};

			//Get booked vehicle info
			$scope.bookVehicle = function(element) {
				$scope.vehicleId = element.id;
				$scope.vehicle_Price = parseFloat($('#price_' + $scope.vehicleId).val()).toFixed(2);
				angular.forEach($scope.vehicleType, function(elem) {
					elem.active = false;
				});
				//              
				element.active = !element.active;
			}

			$scope.keyPress = function() {
				var priceVal = $('#price_' + $scope.vehicleId).val();
				if (priceVal) {
					if (parseInt(priceVal) != 0) {
						$scope.BookNow = true;
					} else {
						$scope.BookNow = false;
					}
				} else {
					$scope.BookNow = false;
				}
			}


			//Trip dispatch
			$scope.funcTripDispatch = function() {
				$scope.pickupId = jQuery('#source-input').val();
				$scope.dropoffId = jQuery('#destination-input').val();
				//validateAddressGeoCoder();
				if ($scope.IssourceplaceChange == false) {
					$("#source-input").val('');
					alert('Pickup address is invalid')
				}
				if ($scope.IsdestinationplaceChange == false) {
					$("#destination-input").val('');
					alert('Dropoff address is invalid');
				}

				$scope.trip.pickup_date = $filter('date')($scope.trip.pickupdate, 'dd/MM/yyyy');
				$scope.trip.pickup_time = $filter('date')(new Date(($scope.trip.pickuptime)).toUTCString(), 'hh:mm a');
				$scope.vehicle_Price = parseFloat($('#price_' + $scope.vehicleId).val()).toFixed(2);
				$scope.tripInfo = {
					first_name: $scope.customerInfo.first_name,
					last_name: $scope.customerInfo.last_name,
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
					passengers_count: $scope.trip.passenger_count ? $scope.trip.passenger_count : '',
					price: $('#price_' + $scope.vehicleId).val() ? parseFloat($('#price_' + $scope.vehicleId).val()).toFixed(2) : '',
					//customer_id: $scope.customerId,
					group_ids: $scope.groupIdArr,
					source_place: $scope.source_place,
					destination_place: $scope.destination_place
				};

				//if ($scope.tripInfo.start_destination.place && $scope.tripInfo.end_destination.place) {
				if ($scope.IssourceplaceChange && $scope.IsdestinationplaceChange) {
					var url = appSettings.serverPath + appSettings.serviceApis.tripCreate;
					$scope.tripInfo.vehicle_type_id = $scope.vehicleId;
					var trip = $scope.tripInfo;
					services.funcPostRequest(url, { 'trip': trip }).then(function(response) {
						$scope.tripId = response.data.trip.id;
						notify({ classes: 'alert-success', message: response.message });
					}, function(error) {
						notify({ classes: 'alert-danger', message: error.message });
					})

				}


			}

			//Trip cancellation
			$scope.funcTripCancel = function() {
				var url = appSettings.serverPath + appSettings.serviceApis.tripcancel;
				var trip = {
					"trip": {
						'id': $scope.tripId
					}
				}
				services.funcPostRequest(url, { "trip_id": $scope.tripId }).then(function(response) {
					console.log(response);
					notify({ classes: 'alert-success', message: response.message });
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

.controller('DispatchTimepickerCtrl', ['$scope', 'countriesConstant', function($scope, constants) {
	if ($scope.trip)
	//$scope.trip.pickuptime = new Date();
		var date = new Date();
	$scope.trip.pickuptime = date.toUTCString();
	//console.log("utc Time", $scope.trip.pickuptime);
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

	//     $scope.clear1 = function() {
	//         if ($scope.trip)
	//             $scope.trip.pickuptime = null;
	//         if ($scope.tripinfo)
	//             $scope.tripinfo.pickup_time = null;
	//     };
}])
