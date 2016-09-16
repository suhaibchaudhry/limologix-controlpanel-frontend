'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:ResetPassEmailCtrl
 * @description
 * # ResetPassEmailCtrl
 * Controller of the limoLogixApp
 */
app
    .controller('ResetPassEmailCtrl', ['notify', '$scope', '$http', 'appSettings', 'services', '$state', 'countriesConstant','$location',
        function(notify, $scope, $http, appSettings, services, $state, constant, $location) {
            $scope.url = {};
            $scope.token = $location.search().token;
            $scope.type = $location.search().type;
            $scope.resetPwd = {
                password: '',
                cnfpassword: ''

            }
            $scope.funcresetPassword = function() {
                if ($scope.resetPwd.password !== $scope.resetPwd.cnfpassword) {
                    $scope.resetPwd.password = $scope.resetPwd.cnfpassword = '';
                    notify({ classes: 'alert-danger', message: 'Password and confirm password does not match' });
                    return;
                };
                var user = {
                    password: $scope.resetPwd.password,
                    reset_password_token:$scope.token,
                    user_type: $scope.type
                };
                var url = appSettings.serverPath + appSettings.serviceApis.restpasswrdfromemail;
                services.funcPostRequest(url,{"user": user}).then(function(response) {
                    notify({ classes: 'alert-success', message: response.message });
                    if(response.type === "Driver"){
                        $('.reset-form').hide();
                        $('.reset_success').show();

                    }else{
                       $state.go('core.login');
                    }
                    
                }, function(error, status) {
                    if (error)
                        notify({ classes: 'alert-danger', message: error.message });
                })
            };

        }
    ]);
