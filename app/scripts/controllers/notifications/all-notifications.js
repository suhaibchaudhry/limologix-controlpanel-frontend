'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:AllNotificationsCtrl
 * @description
 * # AllNotificationsCtrl
 * Controller of the limoLogixApp
 */
app
    .controller('AllNotificationsCtrl', [
        '$scope',
        '$http',
        '$rootScope',
        '$window',
        'appSettings',
        'services',
        'countriesConstant',
        'notify',
        '$filter',
        '$state',
        function($scope, $http, $rootScope, $window, appSettings, services, constant,notify,$filter,$state) {
                $scope.notificaton_size = 0;
                $scope.notificaton_count = 0;
                $scope.page = {
                title: 'Unread notifications',
                subtitle: '' //'Place subtitle here...'
                };
                $scope.isAdmin = false;
                if (constant.user.role == 'admin') {
                        $scope.isAdmin = true;
                        getCompanyChannel();
                        getAllNotifications();
                }

                $scope.loggedUser = constant.user.name;
                //$window.sessionStorage.setItem('notification','')
                // $scope.message = $window.sessionStorage.getItem('notification') ? JSON.parse($window.sessionStorage.getItem('notification')) : '';
                // $scope.notificaton_size = $window.sessionStorage.getItem('notification') ? JSON.parse($window.sessionStorage.getItem('notification')).length : '';
             
                setInterval(function(){ 
                if (constant.user.role == 'admin') {
                        //code goes here that will be run every 5 seconds.   
                        getAllNotifications(); 
                }
                }, 5000);
                
                 $scope.$watch('notificaton_count', function (newVal,oldVal) {
                            $scope.notificaton_count = newVal;
                      },true);
                

             function getCompanyChannel(){        
                var url = appSettings.serverPath + appSettings.serviceApis.companyChannel;
                        services.funcGetRequest(url).then(function(response) {                            
                            $scope.companyChannel = response.data.channel;
                            subscribeToChannel($scope.companyChannel);
                          }, function(error) {
                            //notify({ classes: 'alert-danger', message: error });
                        });
             }

            function getAllNotifications(){        
                var url = appSettings.serverPath + appSettings.serviceApis.getNotifications;
                services.funcPostRequest(url, { "read_status": false }).then(function(response) {
                    if(response.data){
                        $scope.notificationList = response.data.notifications;
                        if($scope.notificationList){
                                 $scope.notificaton_count = $scope.notificationList.length;
                                 //$('.notifications_badge').trigger('click');
                                
                        }                     
                
                    }
                    //$scope.pickup_date = $filter('date')(new Date($scope.notificationList[0].created_at), 'dd/MM/yyyy');
                    //$scope.pickup_time = $filter('date')(new Date($scope.notificationList[0].created_at), 'hh:mm a');

                  }, function(error) {
                    notify({ classes: 'alert-danger', message: error });
                });
             }

            
              $scope.$watch('notificaton_count', function (newVal,oldVal) {
                    $scope.notificaton_count = newVal;
              },true);

//                            
                $scope.message = [];
                var i = 0;
                 $scope.sessionNotifications = [];       
                  
                 
                 

                 var FayeServerURL = appSettings.FayeServerUrl;
                        $scope.client = new Faye.Client(FayeServerURL);
                       // $scope.notification_count_exceed = false;
                           var Logger = {
                            incoming: function(message, callback) {
                               // console.log('incoming', message);
                                callback(message);
                            },
                            outgoing: function(message, callback) {
                                message.ext = message.ext || {};
                                // message.ext.auth_token = $window.sessionStorage['Auth-Token'];
                                // message.ext.auth_token = "8e70d74ca671fc2afa7c7bd0aaf3a39e";
                                //message.ext.user_type = "user";
                                //console.log('outgoing', message);
                                callback(message);
                            }
                        }

                        $scope.client.addExtension(Logger);    


                        
                 function subscribeToChannel(channel){                                                       
                    
                    var subscription = $scope.client.subscribe('/'+channel, function(msg) {
                           // console.log("got a message", msg);
                            i++;
                            //getTimeDifference(msg.time);
                            $scope.singleMsg = {
                                "id":msg.id,
                                "count": i,
                                "title": msg.title,
                                "body": msg.body,
                                "time":msg.time
                            }   
                             
                            getAllNotifications();
                            $scope.message.push($scope.singleMsg);                   


                            $window.sessionStorage.setItem('notification',JSON.stringify($scope.message));
                            $scope.notificaton_size = $window.sessionStorage.getItem('notification') ? JSON.parse($window.sessionStorage.getItem('notification')).length : ''
                            console.log('msg count',$scope.notificaton_size);
                            $window.sessionStorage.setItem('notification_count',$scope.notificaton_size)
                             $('.notifications_badge').trigger('click');
                            //$('.littleFadeInLeft').hide();
                            $('.message_list').trigger('click');


                     $scope.$watch('notificaton_size', function (newVal,oldVal) {
                            $scope.notificaton_size = newVal;
                      },true);


                     
//                      $scope.$apply(function() { 
//                       $rootScope.message1 = $window.sessionStorage.getItem('notification') ? JSON.parse($window.sessionStorage.getItem('notification')) : ''; 
//                       });

                      $scope.$watch('message1', function (newVal,oldVal) {
                            $scope.message1 = $window.sessionStorage.getItem('notification') ? JSON.parse($window.sessionStorage.getItem('notification')) : '';
                      },true); 

                });
                 subscription.then(function() {
                    //alert('Subscription is now active!');
                });
                
                 }
                 
                 $scope.viewNotification = function(notificationId,notificationType){
                         var url = appSettings.serverPath + appSettings.serviceApis.updateNotifications;
                         $scope.data = {
                             "id": notificationId,
                             "read_status": true
                          }
                        services.funcPostRequest(url, { "notification": $scope.data }).then(function(response) {
                                if(notificationType === "trip_dispatch"){
                                  $state.go('app.dispatch.availabledispatches');      
                                }else if(notificationType === "trip_inactive"){
                                  $state.go('app.dispatch.inactivedispatches');       
                                }else if(notificationType === "trip_accept" || notificationType === "trip_start" || notificationType === "trip_stop"){
                                  $state.go('app.dispatch.activedispatches');       
                                }else{
                                  $state.go('app.notifications.notifications-all');        
                                }                              
                                //getAllNotifications();
                          }, function(error) {
                                if(notificationType === "trip_dispatch"){
                                  $state.go('app.dispatch.availabledispatches');      
                                }else if(notificationType === "trip_inactive"){
                                  $state.go('app.dispatch.inactivedispatches');       
                                }else if(notificationType === "trip_accept" || notificationType === "trip_start" || notificationType === "trip_stop"){
                                  $state.go('app.dispatch.activedispatches');       
                                }else{
                                  $state.go('app.notifications.notifications-all');        
                                }    
                            //notify({ classes: 'alert-danger', message: error });
                        });
                 }     
                

//                  if($window.sessionStorage.getItem('notification')){
//                         $scope.sessionNotifications = JSON.parse($window.sessionStorage.getItem('notification'))     
//                         for(var j =0; j< $scope.sessionNotifications.length; j++){
//                                $scope.message.push($scope.sessionNotifications[j]);
//                         }

//                  }

                 
            function getTimeDifference(time) {
                        var notifiedDate = time;
                        var currentDate = new Date();
                        var convertedDate = new Date(notifiedDate)
                        var hourDifference = currentDate.getHours()  - convertedDate.getHours();
                        var minuteDifference =  currentDate.getMinutes() - convertedDate.getMinutes();
                        var dayDiff = currentDate.getDate() - convertedDate.getDate();
//                         console.log(dayDiff);
//                         console.log("hours", hourDifference);
//                         console.log(minuteDifference+"Minutes ago");
                        if(dayDiff >= 1){
                              // $('#search_field').text(dayDiff+"Days "+ "ago")
                               console.log(dayDiff+" Days ago");
                        }
                        else if(dayDiff < 1 && hourDifference < 1)
                               //$('#search_field').text(minuteDifference+"Minutes ago")
                               console.log(minuteDifference+" Minutes ago");
                        else (dayDiff < 1 && hourDifference >= 1 )
                              //$('#search_field').text(hourDifference +"hours ago")
                              console.log(hourDifference+" Hours ago");

            }
          
               

        }
    ]);



  
 // function updateNotifications(){        
//         var url = appSettings.serverPath + appSettings.serviceApis.getNotifications;
//                 services.funcPostRequest(url, { "read_status": false }).then(function(response) {
//                     $scope.groupList = response.data.groups;
//                   }, function(error) {
//                     notify({ classes: 'alert-danger', message: error });
//                 });
// }

