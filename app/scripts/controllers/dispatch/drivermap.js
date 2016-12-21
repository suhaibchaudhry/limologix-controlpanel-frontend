'use strict';

app
  .controller('DriverMapCtrl', function ($scope) {

    $scope.page = {
      title: 'Drivers\' Map',
      subtitle: 'This map refreshes preodically as data is recieved from drivers'
    };

  })

  .controller("leafletMap4", [ "$scope", "$http", function($scope) {

    angular.extend($scope, {
      houston: {
        lat: 29.7630556,
        lng: -95.3630556,
        zoom: 10
      },
      markers: {
      },
      layers: {
        baselayers: {
          googleTerrain: {
            name: 'Google Terrain',
            layerType: 'TERRAIN',
            type: 'google'
          },
          googleHybrid: {
            name: 'Google Hybrid',
            layerType: 'HYBRID',
            type: 'google'
          },
          googleRoadmap: {
            name: 'Google Streets',
            layerType: 'ROADMAP',
            type: 'google'
          }
        }
      }
    });
    $scope.removeMarkers = function() {
        $scope.markers = {};
    }

    $scope.addMarkers = function() {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() {
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
              //callback(xmlHttp.responseText);
              $scope.removeMarkers();
              var drivers = JSON.parse(xmlHttp.responseText);
              var markers = {};
              for(var d in drivers) {
                markers[drivers[d].driver_id] = {
                  lat: drivers[d].latlon.x,
                  lng: drivers[d].latlon.y
                };
              }
              angular.extend($scope, {
                  markers: markers
              });
          }
      }
      xmlHttp.open("GET", 'http://limologix.softwaystaging.com/drivermap', true); // true for asynchronous
      xmlHttp.send(null);
    };

    if($scope.interval) {
      //console.log("Clear Interval");
      clearInterval($scope);
    }
    $scope.addMarkers();
    $scope.interval = setInterval(function() {
      //console.log("Running interval");
      $scope.addMarkers();
    }, 5000);
  }]);
