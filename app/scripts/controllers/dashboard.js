'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the minovateApp
 */
app
    .controller('DashboardCtrl', [
        '$scope',
        '$http',
        '$rootScope',
        '$window',
        'appSettings',
        'services',
        'countriesConstant',
        function($scope, $http, $rootScope, $window, appSettings, services, constant) {
            $scope.notificaton_size = 0;
            $scope.page = {
                title: 'Dashboard',
                subtitle: '' //'Place subtitle here...'
            };
            if (constant.userRole == 'admin') {
                getCompanyInfo();
            }   
                          
           $scope.loggedUser = constant.user.name;
//           $window.sessionStorage.setItem('notification','')
//            $scope.message1 = $window.sessionStorage.getItem('notification') ? JSON.parse($window.sessionStorage.getItem('notification')) : '';
//            $scope.notificaton_size = $window.sessionStorage.getItem('notification') ? JSON.parse($window.sessionStorage.getItem('notification')).length : '';
         
                    

            function getCompanyInfo() {
                var url = appSettings.serverPath + appSettings.serviceApis.company_info;
                services.funcGetRequest(url).then(function(response) {
                    var response = response.data.company;
                    $scope.companyInfo = {
                        logoUrl: response.logo.image
                    }
                    displayLogo();
                }, function(error) {

                })
            }
           

            function displayLogo() {
                $scope.picFilePreview = appSettings.server_images_path + $scope.companyInfo.logoUrl;
            }
        }
    ]);
