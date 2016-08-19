'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:CustomGroupInfoDriversCtrl
 * @description
 * # CustomGroupInfoDriversCtrl
 * Controller of the limoLogixApp
 */
app
    .controller('CustomGroupInfoDriversCtrl', ['$scope',
        function($scope) {
            $scope.page = {
                title: 'Group Information',
                subtitle: '', //'Place subtitle here...'
            };
//             if (constant.userRole == 'admin') {
//                 $scope.isAdmin = true;   
//             }
        }
    ])
    .controller('TableCustomGroupInfoDriversCtrl', function($scope, $rootScope, DTOptionsBuilder,
        DTColumnDefBuilder, DTColumnBuilder, $resource, $state, $http, appSettings, notify, $window,
        services, $stateParams) {

        var vm = this;
        vm.drivers = [];
        vm.addDriversToGroupBtn = false;
        //getDriversList();
        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withBootstrap()
            .withOption('driver', [
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
        vm.arrayOfDriverIds = [];

        vm.selectAll = function() {
            if ($scope.selectedAll) {
                $scope.selectedAll = false;
            } else {
                $scope.selectedAll = true;
            }
            angular.forEach(vm.orders, function(order) {
                order.selected = $scope.selectedAll;
                if (order.selected)
                    vm.arrayOfDriverIds.push(order.id);

            });
        };

        vm.selectedDriversArr = [];
        vm.uncheckeddriversIdArr = [];



        //function to get selected driver ids.
        vm.selectedDriver = function(driver) {


            if (driver.selected) {
                vm.selectedDriversArr.push(driver);
                vm.obj = vm.selectedDriversArr;
                vm.uncheckeddriversIdArr.push(driver.id);
            } else {
                var listToDelete = vm.uncheckeddriversIdArr;
                for (var i = 0; i < vm.selectedDriversArr.length; i++) {
                    //remove obj from array based on obj property
                    if (vm.selectedDriversArr[i].id == driver.id) {
                        vm.selectedDriversArr.splice(i, 1);
                        break;
                    }

                }
            }
            vm.arrayOfDriverIds = [];
            for (var i = 0; i < vm.selectedDriversArr.length; i++) {
                vm.arrayOfDriverIds.push(vm.selectedDriversArr[i].id);
                vm.arrayOfDriverIds = unique(vm.arrayOfDriverIds);
            }
            console.log('final', vm.arrayOfDriverIds);
            if (vm.arrayOfDriverIds.length) {
                vm.addDriversToGroupBtn = true;
            } else {
                vm.addDriversToGroupBtn = false;
            }

        }


        //remove duplicates from array
        function unique(list) {
            var result = [];
            $.each(list, function(i, e) {
                if ($.inArray(e, result) == -1) result.push(e);
            });
            return result;
        }


        var id_val = parseInt($stateParams.group_id);
        getDrivers(id_val);

        //function to get drivers list
        function getDrivers(id_val) {

            vm.group = {
                "id": id_val,
                "page": 0,
                "per_page": 0
            }
            var url = appSettings.serverPath + appSettings.serviceApis.getDrivers;
            services.funcPostRequest(url, { "group": vm.group }).then(function(response) {
                vm.drivers =  response.data ? response.data.drivers : '';
            }, function(error) {
                //notify({ classes: 'alert-danger', message: error });
            });
        }


        //function to view individual driver details
        vm.getIndividualDriverDetails = function(driver_id) {
                 $state.go('app.custom-groups.single-driver', {"group_id":parseInt($stateParams.group_id),"driver_id":driver_id});
            //$state.go('app.custom-groups.groups-info-single-drivers', { "group_id": parseInt($stateParams.group_id), "driver_id": driver_id });
        }

        //Remove Drivers from custom groups
        vm.funcRmoveDriversFromCusGroup = function(rem_diversId) {
            swal({
                title: "Are you sure?",
                text: "You want to remove this driver from the group?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, remove it!",
                closeOnConfirm: false
            }, function(isConfirm) {
                if (!isConfirm) return;


                vm.group = {
                    id: parseInt($stateParams.group_id),
                    driver_ids: vm.arrayOfDriverIds
                }
                var url = appSettings.serverPath + appSettings.serviceApis.RemoveDrivers;
                services.funcPostRequest(url, { "group": vm.group }).then(function(response) {
                    notify({ classes: 'alert-success', message: response.message });
                    swal("Done!", "It was succesfully deleted!", "success");
                    $state.go('app.custom-groups.groups-info');
                }, function(error) {
                    swal("Error deleting!", "Please try again", "error");
                    //notify({ classes: 'alert-danger', message: error });
                });

            });

        }
    })
