'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:CustomGroupsSingleDriverCtrl
 * @description
 * # CustomGroupsSingleDriverCtrl
 * Controller of the limoLogixApp
 */
app
    .controller('CustomGroupsSingleDriverCtrl', ['$scope', '$state', '$http', 'notify', 'appSettings', 'services', '$stateParams',
        function($scope, $state, $http, notify, appSettings, services, $stateParams) {
            $scope.page = {
                title: 'Single Driver',
                subtitle: '', //'Place subtitle here...'
            };
            $scope.groupId = parseInt($stateParams.group_id);
            $scope.imagePath = appSettings.server_images_path;
            funcGetDetails();

            function funcGetDetails() {

                var url = appSettings.serverPath + appSettings.serviceApis.getIndividualDriverDetail;
                var postData = {
                    "driver": {
                        "id": $stateParams.driver_id
                    }
                };
                services.funcPostRequest(url, postData).then(function(response) {
                    $scope.driversList = response.data.driver;
                    console.log("driversList", $scope.driversList);
                }, function(error) {
                    notify({ classes: 'alert-danger', message: error });
                })
            }
            $scope.funcBlock = function() {
                var url = appSettings.serverPath + appSettings.serviceApis.userBlock;
                var postData = {
                    "driver": {
                        "id": $stateParams.driver_id
                    }
                };
                services.funcPostRequest(url, postData).then(function(response) {
                    notify({ classes: 'alert-success', message: response.message });
                }, function(error) {
                    notify({ classes: 'alert-danger', message: error });
                })

            }
            $scope.funcDisapprove = function() {
                var url = appSettings.serverPath + appSettings.serviceApis.userDisapprove;
                var postData = {
                    "driver": {
                        "id": $stateParams.driver_id
                    }
                };
                services.funcPostRequest(url, postData).then(function(response) {
                    notify({ classes: 'alert-success', message: response.message });
                }, function(error) {
                    notify({ classes: 'alert-danger', message: error });
                })
            }
            $scope.funcApprove = function() {
                var url = appSettings.serverPath + appSettings.serviceApis.userApprove;
                var postData = {
                    "driver": {
                        "id": $stateParams.driver_id
                    }
                };
                services.funcPostRequest(url, postData).then(function(response) {
                    notify({ classes: 'alert-success', message: response.message });
                }, function(error) {
                    notify({ classes: 'alert-danger', message: error });
                })
            }

        }
    ]);
