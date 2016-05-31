'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:ForgotPasswordCtrl
 * @description
 * # ForgotPasswordCtrl
 * Controller of the minovateApp
 */
app
    .controller('ForgotPasswordCtrl', ['notify', '$scope', '$http', 'appSettings', 'services', '$state', 'countriesConstant',
        function(notify, $scope, $http, appSettings, services, $state, constant) {
            $scope.page = {
                title: 'Forgot Password',
                subtitle: '' //'Place subtitle here...'
            };

            $scope.forgotPwd = {
                email: ''
            }
            $scope.forgotPwd = {};
            $scope.funcforgotPassword = function(isValid) {
                var user = {
                    email: $scope.forgotPwd.email
                };
                var url = appSettings.serverPath + appSettings.serviceApis.forgotPassword;
                services.funcPostRequest(url, { "user": user }).then(function(response) {
                    notify({ classes: 'alert-success', message: response.message });
                    $state.go('app.profile.my_account');
                }, function(error, status) {
                    if (error)
                        notify({ classes: 'alert-danger', message: error.message });
                })
            };

        }
    ]);
