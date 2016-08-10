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

//                 var FayeServerURL = appSettings.FayeServerUrl
//                 var client = new Faye.Client(FayeServerURL);
//                 $scope.notification_count_exceed = false;
//                    var Logger = {
//                     incoming: function(message, callback) {
//                        // console.log('incoming', message);
//                         callback(message);
//                     },
//                     outgoing: function(message, callback) {
//                         message.ext = message.ext || {};
//                         // message.ext.auth_token = $window.sessionStorage['Auth-Token'];
//                         // message.ext.auth_token = "8e70d74ca671fc2afa7c7bd0aaf3a39e";
//                         //message.ext.user_type = "user";
//                         //console.log('outgoing', message);
//                         callback(message);
//                     }
//                 }

//                 client.addExtension(Logger);
//                 $scope.message = [];
//                 var i = 0;
//                  $scope.sessionNotifications = []
               

//                 if (constant.userRole == 'admin') {
//                     var subscription = client.subscribe('/publish/company_145', function(msg) {
//                     console.log("got a message", msg);
//                     i++;
                 
//                     $scope.singleMsg = {
//                         "count": i,
//                         "title": msg.title,
//                         "body": msg.body
//                     }   
                                            
//                     $scope.message.push($scope.singleMsg);


//                     $window.sessionStorage.setItem('notification',JSON.stringify($scope.message));
//                     $scope.notificaton_size = $window.sessionStorage.getItem('notification') ? JSON.parse($window.sessionStorage.getItem('notification')).length : ''
//                     console.log('msg count',$scope.notificaton_size);
//                     $window.sessionStorage.setItem('notification_count',$scope.notificaton_size)
//                     $('.notifications_badge').trigger('click');
//                     //$('.message_list').trigger('click');


//                      $scope.$watch('notificaton_size', function (newVal,oldVal) {
//                             $scope.notificaton_size = newVal;
//                       },true);
                     
// //                      $scope.$apply(function() { 
// //                       $rootScope.message1 = $window.sessionStorage.getItem('notification') ? JSON.parse($window.sessionStorage.getItem('notification')) : ''; 
// //                       });

//                       $scope.$watch('message1', function (newVal,oldVal) {
//                             $scope.message1 = $window.sessionStorage.getItem('notification') ? JSON.parse($window.sessionStorage.getItem('notification')) : '';
//                       },true); 

//                 });
//                 }                          
                

//                  if($window.sessionStorage.getItem('notification')){
//                         $scope.sessionNotifications = JSON.parse($window.sessionStorage.getItem('notification'))     
//                         for(var j =0; j< $scope.sessionNotifications.length; j++){
//                                $scope.message.push($scope.sessionNotifications[j]);
//                         }

//                  }      
//                 subscription.then(function() {
//                     alert('Subscription is now active!');
//                 });

        }
    ]);
