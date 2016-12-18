'use strict';

app.provider('dispatchRideProvider', [funcservices]);

function funcservices() {
    //Get routes and display route direction in google map
    return {
        $get: function($http, $q) {
            return {                
                getRoutes:function(place,pickup,dropoff,notify){        	 

                }
            };
        }
    }

}
