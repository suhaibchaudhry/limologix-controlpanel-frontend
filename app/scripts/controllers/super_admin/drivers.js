'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:DriversCtrl
 * @description
 * # DriversCtrl
 * Controller of the minovateApp
 */
app
    .controller('DriversCtrl', function($scope) {
        $scope.page = {
            title: 'Drivers',
            subtitle: '',//'Place subtitle here...'
        };
    })
    .controller('OrdersTableCtrl', function($scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $resource, $state, $http, appSettings, notify, $window, services) {
       
        var vm = this;
        vm.orders = [];
        getDriversList();
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


        function getDriversList() {
            var url = appSettings.serverPath + appSettings.serviceApis.getDriverList;
            services.funcPostRequest(url, { "page": '0', "per_page": '0' }).then(function(response) {
                $scope.driversList = response.data.drivers;
                vm.orders = $scope.driversList;
                console.log('vm.orders',vm.orders);
            }, function(error) {
                notify({ classes: 'alert-danger', message: error });
            });
        }


        vm.getIndividualDriverDetails = function(driver_id){
            console.log('id',driver_id);
            $state.go('app.driver.single-driver', {"driver_id":driver_id});
        }      

    })
