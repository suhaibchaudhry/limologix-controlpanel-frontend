'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:PendingDispatchesCtrl
 * @description
 * # PendingDispatchesCtrl
 * Controller of the minovateApp
 */
/*app
    .controller('ActiveDispatchesCtrl', [
        '$scope',
        '$http',
        'appSettings',
        'services',
        'notify',
        '$rootScope',
        function($scope, $http, appSettings, services, notify, $rootScope) {
            $scope.page = {
                title: 'Active Dispatches',
                subtitle: ''
            }

            getActiveList();

            function getActiveList() {
                var url = appSettings.serverPath + appSettings.serviceApis.tripPending;
                services.funcPostRequest(url, { 'trip_status': 'active' }).then(function(response) {
                    $scope.pending_dispatch_count = Object.keys(response.data.trips).length;
                    $scope.tripList = response.data.trips;
                    console.log('response',response.data);
                }, function(error) {
                    notify({ classes: 'alert-danger', message: error });
                });
            }

        }
    ]);
*/

'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:DriversCtrl
 * @description
 * # DriversCtrl
 * Controller of the minovateApp
 */
app
   .controller('ActiveDispatchesCtrl', function($scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $resource, $state, $http, appSettings, notify, $window, services,countriesConstant) {
        $scope.page = {
            title: 'Active Dispatches',
            subtitle: '',//'Place subtitle here...'
        };
        
        var vm = this;
        vm.activeDispatches = [];
        
        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withBootstrap()
            .withOption('order', [
                [1, 'asc']
            ])
            .withDOM('<"row"<"col-md-8 col-sm-12"<"inline-controls"l>><"col-md-4 col-sm-12"<"pull-right"f>>>t<"row"<"col-md-4 col-sm-12"<"inline-controls"l>><"col-md-4 col-sm-12"<"inline-controls text-center"i>><"col-md-4 col-sm-12"p>>')
            .withLanguage({
                "sLengthMenu": 'View _MENU_ records',
                "sInfo": 'Found _TOTAL_ records',
                "oPaginate": {
                    "sPage": "Page",
                    "sPageOf": "of"
                }
            })
            .withPaginationType('input')
            //.withScroller()
            //.withOption("sScrollY", false)
            //.withOption("sScrollX")
            .withColumnFilter();


        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).notSortable(),
            DTColumnDefBuilder.newColumnDef(8).notSortable()
        ];

        vm.selectedAll = false;

        vm.selectAll = function() {

            if ($scope.selectedAll){
                $scope.selectedAll = false;
        
            } else {
                $scope.selectedAll = true;
            } 

            angular.forEach(vm.orders, function(order) {
                order.selected = $scope.selectedAll;
            });
        };
        if (countriesConstant.userRole == 'admin') {
         getActiveList();
        }

            function getActiveList() {
                var url = appSettings.serverPath + appSettings.serviceApis.tripPending;
                services.funcPostRequest(url, { 'trip_status': 'active' }).then(function(response) {
                    if(response.data){
                        $scope.pending_dispatch_count = Object.keys(response.data.trips).length;
                        $scope.tripList = response.data.trips;
                        vm.activeDispatches = $scope.tripList;    
                    }                  
                
                }, function(error) {
                    notify({ classes: 'alert-danger', message: error });
                });
            }

        /*function getDriversList() {
            var url = appSettings.serverPath + appSettings.serviceApis.getDriverList;
            services.funcPostRequest(url, { "page": '0', "per_page": '0' }).then(function(response) {
                $scope.driversList = response.data.drivers;
                vm.orders = $scope.driversList;
                console.log('vm.orders',vm.orders);
            }, function(error) {
                notify({ classes: 'alert-danger', message: error });
            });
        }
*/ 

        vm.getIndividualCustomersDetails = function(active_customer_id){
            console.log('id',active_customer_id);
            $state.go('app.dispatch.single-activedispatches', {"active_customer_id":active_customer_id});
        }     

    })
        
