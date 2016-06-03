'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:MyAccountCtrl
 * @description
 * # MyAccountCtrl
 * Controller of the limoLogixApp
 */
app
    .controller('MyAccountCtrl', [
        '$scope',
        '$http',
        'appSettings',
        '$window',
        'notify',
        'services',
        '$filter',
        function($scope, $http, appSettings, $window, notify, services, $filter) {
            $scope.page = {
                title: 'My Account',
                subtitle: '' //'Place subtitle here...'
            };
            $scope.phoneNumbr = /^\+?\d{1}[- ]?\d{3}[- ]?\d{3}[- ]?\d{4}$/;
            $scope.adminInfo = {
                first_name: '',
                last_name: '',
                email: '',
                mobile_number: ''
            }

            getProfileInfo();

            function getProfileInfo() {
                var url = appSettings.serverPath + appSettings.serviceApis.my_profile;
                services.funcGetRequest(url).then(function(response) {
                    var user = response.data.user;
                    $scope.adminInfo = {
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        mobile_number: user.mobile_number
                    }
                    //notify({ classes: 'alert-success', message: response.message });
                }, function(error, status) {
                    if (response)
                        notify({ classes: 'alert-danger', message: response.message });
                })

            };
            // function to update user profile
            $scope.funcUpdateProfile = function(isValid) {
                var user = {
                    first_name: $scope.adminInfo.first_name,
                    last_name: $scope.adminInfo.last_name,
                    email: $scope.adminInfo.email,
                    mobile_number: $scope.adminInfo.mobile_number
                };
                var url = appSettings.serverPath + appSettings.serviceApis.profileupdate;
                services.funcPostRequest(url, { "user": user }).then(function(response) {
                    notify({ classes: 'alert-success', message: response.message });
                }, function(error, status) {
                    if (response)
                        notify({ classes: 'alert-danger', message: response.message });
                })

            };
          
        }
    ])
  
