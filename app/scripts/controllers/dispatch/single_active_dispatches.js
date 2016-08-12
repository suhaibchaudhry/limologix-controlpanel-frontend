'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:SingleDriverCtrl
 * @description
 * # SingleDriverCtrl
 * Controller of the minovateApp
 */
app
    .controller('SingleActiveDispatchCtrl', ['$scope', '$window', '$state', '$http', 'dispatchRideProvider', 'notify', 'appSettings', 'services', '$stateParams',
       
        function($scope, $state, $window, $http, dispatchRideProvider, notify, appSettings, services, $stateParams) {
            $scope.page = {
                title: 'Single Driver',
                subtitle: '', //'Place subtitle here...'
            };
            $scope.imagePath = appSettings.server_address;
            $scope.isDispatchActive = false;
            getActiveList();
//             $scope.tripsummary = {
//                 pickupAt: 'Marathahalli, Bengaluru, Karnataka 560037, India',
//                 dropoffAt: 'Hebbal, Bengaluru, Karnataka 560024, India'
//             }

            

            function getActiveList() {
                var url = appSettings.serverPath + appSettings.serviceApis.tripSummary;
                services.funcPostRequest(url, { 'trip_id': parseInt($stateParams.active_customer_id)}).then(function(response) {
                    //$scope.pending_dispatch_count = Object.keys(response.data.trip).length;
                    $scope.dispatch_data = response.data.trip;
                    $scope.dispatch_customer = response.data.trip.customer;
                    $scope.dispatch_source = response.data.trip.start_destination;
                    $scope.dispatch_destination = response.data.trip.end_destination;
                   // $scope.dispatch_driver = response.data.trip.driver;
                    //get driver info only when dispatch status is active
                    if(response.data.trip.driver){
                        $scope.isDispatchActive = true;
                        $scope.dispatch_driver = response.data.trip.driver;
                    }else{
                        $scope.isDispatchActive = false;
                    }
                       

                    // $scope.channelName = response.data.trips[0].driver.channel;
                    //subscribeToChannel();
                }, function(error) {
                    notify({ classes: 'alert-danger', message: error });
                });
            }

            setTimeout(function() {
                dispatchRideProvider.getRoutes($scope.dispatch_source.place,$scope.dispatch_destination.place, notify);
            }, 5000)

//             function subscribeToChannel() {
//                 var Logger = {
//                     incoming: function(message, callback) {
//                         console.log('incoming', message);
//                         callback(message);
//                     },
//                     outgoing: function(message, callback) {
//                         message.ext = message.ext || {};
//                         // message.ext.auth_token = $window.sessionStorage['Auth-Token'];
//                         // message.ext.auth_token = "8e70d74ca671fc2afa7c7bd0aaf3a39e";
//                         //message.ext.user_type = "user";
//                         console.log('outgoing', message);
//                         callback(message);
//                     }
//                 }

//                 var FayeServerURL = appSettings.FayeServerUrl
//                 var client = new Faye.Client(FayeServerURL);
//                 $scope.notification_count_exceed = false;
//                 client.addExtension(Logger);
//                 // toast_notification();
//                 //////
//                 $scope.message = [];
//                 var i = 0;
                 
//                //   loaStorage.setItem('notification_count')
                
//                 var subscription = client.subscribe('/publish/company_145', function(message) {
//                    // alert(JSON.stringify(message))
//                   //  console.log("message", message)
//                    // alert("hii" + message.title);
//                     console.log("got a message", message);
//                     i++;

//                     var message = {
//                         "count": i,
//                         "title": message.title,
//                         "body": message.body
//                     }
//                     $scope.message.push(message);  
//                     $scope.notification_count = $scope.message.length;

//                      $scope.notificaton_size = JSON.parse(localStorage.getItem('notification')).length

                     
//                 if($scope.notificaton_size > 3){
//                     $scope.notification_count_exceed = true;
//                 }


//                     localStorage.setItem('notification',JSON.stringify($scope.message))
//                     localStorage.setItem('notification_count',$scope.notificaton_size)
//                     localStorage.setItem('notification_count_exceed',$scope.notification_count_exceed)
//                     //localStorage['notification'] = JSON.stringify($scope.message);
//                     //localStorage['notification_count'] = $scope.notification_count ;              
//                     //$window.sessionStorage['noti_msg'] = 
//                     //$scope.message1 =  JSON.parse($window.sessionStorage['notification']);
//                      //$window.sessionStorage['notification'].
//                 });
//                 subscription.then(function() {
//                     alert('Subscription is now active!');
//                 });

//                 var notificaton_size = parseInt(localStorage.getItem('notification_count'))
//                 if(notification_size > 3){
//                     $scope.notification_count_exceed = true;
//                 }
                



                //  var FayeServerURL = appSettings.FayeServerUrl;
                //  var client = new Faye.Client(FayeServerURL);
                //  client.addExtension(Logger);
                //  //console.log($scope.channelName)
                //  // return {
                //  //     publish: function(channel, message) {
                //  //         client.publish(channel, message);
                //  //     },

                //  //     subscribe: function(channel, callback) {
                //  //         client.subscribe(channel, callback);
                //  //     }
                //  // }
                // // client.subscribe($scope.channelName, function(message) {
                // var subscription = client.subscribe('/publish/company_145', function(message) {  
                //  alert('asd');
                //      console.log("message", message)
                //  })
                //  subscription.then(function() {
                //    alert('Subscription is now active!');
                //  });
            //}
            // $scope.driver_id = $state.get('driver_id') || undefined;

            // funcGetDetails();

            // function funcGetDetails() {

            //     var url = appSettings.serverPath + appSettings.serviceApis.getIndividualDriverDetail;
            //     var postData = {
            //         "driver": {
            //             "id": $stateParams.driver_id
            //         }
            //     };
            //     services.funcPostRequest(url, postData).then(function(response) {
            //         $scope.driversList = response.data.driver;
            //         console.log("driversList", $scope.driversList);
            //     }, function(error) {
            //         notify({ classes: 'alert-danger', message: error });
            //     })
            // }
            //getIndividualDriverDetails();


        }
    ])
    // // Simple Faye service
    // .factory('Faye', function($window) {
    //     var Logger = {
    //         incoming: function(message, callback) {
    //             //console.log('incoming', message);
    //             callback(message);
    //         },
    //         outgoing: function(message, callback) {
    //             message.ext = message.ext || {};
    //             message.ext.auth_token = $window.sessionStorage['Auth-Token'];
    //             message.ext.user_type = "driver";
    //             //console.log('outgoing', message);
    //             callback(message);
    //         }
    //     };

//     var FayeServerURL = 'http://172.16.90.117:9292/faye';
//     var client = new Faye.Client(FayeServerURL);
//     client.addExtension(Logger);
//     return {
//         publish: function(channel, message) {
//             client.publish(channel, message);
//         },

//         subscribe: function(channel, callback) {
//             client.subscribe(channel, callback);
//         }
//     }
// })

// .controller('ToasterDemoCtrl', ['$scope', 'toastr', 'toastrConfig', function($scope, toastr, toastrConfig) {
//     //openToast();
//     var openedToasts = [];

//     $scope.toast = {
//         colors: [
//             { name: 'primary' },
//             { name: 'success' },
//             { name: 'warning' },
//             { name: 'error' },
//             { name: 'info' },
//             { name: 'default' },
//             { name: 'cyan' },
//             { name: 'amethyst' },
//             { name: 'green' },
//             { name: 'orange' },
//             { name: 'red' },
//             { name: 'greensea' },
//             { name: 'dutch' },
//             { name: 'hotpink' },
//             { name: 'drank' },
//             { name: 'blue' },
//             { name: 'lightred' },
//             { name: 'slategray' },
//             { name: 'darkgray' }
//         ],
//         msg: 'Gnome & Growl type non-blocking notifications',
//         title: 'This is toaster notification'
//     };

//     $scope.options = {
//         position: 'toast-top-right',
//         type: 'success',
//         iconClass: $scope.toast.colors[1],
//         timeout: '5000',
//         extendedTimeout: '1000',
//         html: false,
//         closeButton: true,
//         tapToDismiss: true,
//         closeHtml: '<i class="fa fa-times"></i>'
//     };

//     $scope.$watchCollection('options', function(newValue) {
//         toastrConfig.allowHtml = newValue.html;
//         toastrConfig.extendedTimeOut = parseInt(newValue.extendedTimeout, 10);
//         toastrConfig.positionClass = newValue.position;
//         toastrConfig.timeOut = parseInt(newValue.timeout, 10);
//         toastrConfig.closeButton = newValue.closeButton;
//         toastrConfig.tapToDismiss = newValue.tapToDismiss;
//         toastrConfig.closeHtml = newValue.closeHtml;
//     });

//     $scope.clearLastToast = function() {
//         var toast = openedToasts.pop();
//         toastr.clear(toast);
//     };

//     $scope.clearToasts = function() {
//         toastr.clear();
//     };

//     //     $scope.openToast = function() {

//     //       var toast = toastr[$scope.options.type]($scope.toast.msg, $scope.toast.title, {
//     //                     iconClass: 'toast-'+$scope.options.iconClass.name + ' ' + 'bg-'+$scope.options.iconClass.name
//     //                   });

//     //       openedToasts.push(toast);

//     //     };
//     function openToast() {

//         var toast = toastr[$scope.options.type]($scope.toast.msg, $scope.toast.title, {
//             iconClass: 'toast-' + $scope.options.iconClass.name + ' ' + 'bg-' + $scope.options.iconClass.name
//         });

//         openedToasts.push(toast);

//     };

// }]);
