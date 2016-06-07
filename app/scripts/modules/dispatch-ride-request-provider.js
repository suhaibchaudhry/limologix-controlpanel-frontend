'use strict';

app.provider('dispatchRideProvider', [funcservices]);

function funcservices() {
    //Get routes and display route direction in google map
    return {
        $get: function($http, $q) {
            return {
                getRoutes:function(pickup,dropoff){
                    var source, destination;
                    var directionsDisplay;
                    var directionsService = new google.maps.DirectionsService();
                    directionsDisplay = new google.maps.DirectionsRenderer({
                        suppressMarkers: true,
                        polylineOptions: {
                            strokeColor: "#9ACD32",
                            strokeWeight: 5
                        }
                    });
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
                    // var mapOptions = {
                    //                         zoom: 7,
                    //                         center: mumbai
                    //                     };
                    var map = new google.maps.Map(document.getElementById('dvMap'));
                    directionsDisplay.setMap(map);
                    //directionsDisplay.setPanel(document.getElementById('dvPanel'));

                    //*********DIRECTIONS AND ROUTE**********************//
                    source = pickup; //'Marathahalli, Bengaluru, Karnataka 560037, India'; 
                    destination = dropoff; //'Hebbal, Bengaluru, Karnataka 560024, India';

                    var request = {
                        origin: source,
                        destination: destination,
                        travelMode: google.maps.TravelMode.DRIVING
                    };
                    directionsService.route(request, function(response, status) {
                        if (status == google.maps.DirectionsStatus.OK) {
                            directionsDisplay.setDirections(response);
                            var leg = response.routes[0].legs[0];
                            makeMarker(leg.start_location, icons.start, source, map);
                            makeMarker(leg.end_location, icons.end, destination, map);
                        } else {
                            notify({ classes: 'alert-error', message: 'unable to retrive route' });
                        }
                    });

                    function makeMarker(position, icon, title, map) {
                        new google.maps.Marker({
                            position: position,
                            map: map,
                            icon: icon,
                            title: title
                        });
                    }
                }
            };
        }
    }

}
