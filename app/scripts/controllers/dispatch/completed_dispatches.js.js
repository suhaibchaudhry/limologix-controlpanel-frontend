'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:DriversCtrl
 * @description
 * # DriversCtrl
 * Controller of the limoLogixApp
 */
app
   .controller('CompletedDispatchesCtrl', function($scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $resource, $state, $http, appSettings, notify, $window, services,countriesConstant) {
        $scope.page = {
            title: 'Inactive Dispatches',
            subtitle: '',//'Place subtitle here...'
        };
        
        var vm = this;
        vm.inactiveDispatches = [];
        
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
            DTColumnDefBuilder.newColumnDef(6).notSortable()
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
                services.funcPostRequest(url, { 'trip_status': 'inactive' }).then(function(response) {
                    if(response.data){
                        $scope.inactive_dispatch_count = Object.keys(response.data.trips).length;
                        $scope.tripList = response.data.trips;
                        vm.inactiveDispatches = $scope.tripList;    
                    }                  
                
                }, function(error) {
                    notify({ classes: 'alert-danger', message: error });
                });
            }
       
        vm.getIndividualDispatchDetails = function(trip_id){
           // console.log('id',trip_id);
            $state.go('app.dispatch.single-inactivedispatches', {"trip_id":trip_id});
        }     

    })
        
