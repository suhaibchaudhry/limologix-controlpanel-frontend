'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:CustomGroupDriversCtrl
 * @description
 * # CustomGroupDriversCtrl
 * Controller of the minovateApp
 */
app
    .controller('CustomGroupDriversCtrl', ['$scope','$rootScope','notify','appSettings','services','$state','countriesConstant',
    function($scope,$rootScope,notify,appSettings,services,$state,countriesConstant) {
        $scope.page = {
            title: 'Create Groups',
            subtitle: '',//'Place subtitle here...'
        };
        $scope.toggle = false;
       
//         $scope.CreateBucket = function(){
//             $scope.group = {
//                 "name": $scope.title,
//                 "description":  $scope.Description
//             }
//             var url = appSettings.serverPath + appSettings.serviceApis.createCustomGroup;
//                 services.funcPostRequest(url, { 'group': $scope.group }).then(function(response) {
//                    notify({ classes: 'alert-success', message: response.message });
//                   $scope.toggle = false;
//                 }, function(error) {
//                     notify({ classes: 'alert-danger', message: error });
//                 });
//         }
//         funcGetCustomGroupsList();
//         function funcGetCustomGroupsList(){
//             var url = appSettings.serverPath + appSettings.serviceApis.getCustomGroups;
//                 services.funcPostRequest(url, {"page": 0,"per_page": 0}).then(function(response) {
//                    $scope.groupslist = response.data.groups;
//                    //notify({ classes: 'alert-success', message: response.message });
//                 }, function(error) {
//                     notify({ classes: 'alert-danger', message: error });
//                 });
//         }

//         $scope.AddDriversToGroup = function(groupId){
//              $rootScope.selectedGroupId = groupId;
//              $state.go('app.custom-groups.create-groups-drivers');
//         }
    }])
    .controller('CustomGroupAddDriversCtrl', function($scope, $rootScope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $resource, $state, $http, appSettings, notify, $window, services,$stateParams) {
       
        var vm = this;
        vm.orders = [];
        vm.addDriversToGroupBtn = false;
        if($stateParams.group_id)
           getGroupDriversList();
//         setTimeout(function(){
//            getGroupDriversList();     
//         },2000)
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
        vm.arrayOfDriverIds = [];

        vm.selectAll = function() {
            if ($scope.selectedAll){
                $scope.selectedAll = false;
            } else {
                $scope.selectedAll = true;
            } 
            angular.forEach(vm.orders, function(order) {
                order.selected = $scope.selectedAll;
                if(order.selected)
                   vm.arrayOfDriverIds.push(order.id);

            });
             console.log('saaaaa',vm.arrayOfDriverIds)
        };
       
        vm.selectedDriversArr = [];
        vm.uncheckeddriversIdArr = [];
       
        //$scope.addDriversToGroupBtn = false;
        vm.selectedDriver = function(order){

//                 var listToDelete = [1, 2];
//                 var arrayOfObjects = [{id:1,name:'dummy'}, // delete me
//                                       {id:2,name:'shilpa'}, // delete me
//                                       {id:3,name:'avinash'}] // all that should remain
//                 for(var i = 0; i < arrayOfObjects.length; i++) {
//                     vm.obj = arrayOfObjects[i];

//                     if(listToDelete.indexOf(vm.obj.id) !== -1) {
//                         arrayOfObjects.splice(i, 1);
//                     }
//                 }

            if(order.selected){
                vm.selectedDriversArr.push(order);
                vm.obj = vm.selectedDriversArr;
                vm.uncheckeddriversIdArr.push(order.id);
            }else{
                var listToDelete = vm.uncheckeddriversIdArr;
                for(var i=0; i < vm.selectedDriversArr.length; i++){
                    //remove obj from array based on obj property
                    if(vm.selectedDriversArr[i].id == order.id){
                        vm.selectedDriversArr.splice(i, 1);
                        break;
                    }
                    //vm.selectedDriversArr.splice(i);
                    //vm.obj = vm.selectedDriversArr[i];
                }
            }
           vm.arrayOfDriverIds = [];
          //console.log('selected drivers',vm.selectedDriversArr,vm.obj); 
          for(var i=0; i < vm.selectedDriversArr.length; i++){
               vm.arrayOfDriverIds.push(vm.selectedDriversArr[i].id);
               vm.arrayOfDriverIds = unique(vm.arrayOfDriverIds);
          }         
           console.log('final',vm.arrayOfDriverIds);
           if(vm.arrayOfDriverIds.length){
               vm.addDriversToGroupBtn = true;
           }else{
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

        function getGroupDriversList() {
                vm.data = {
                    "group": {
                        "id": parseInt($stateParams.group_id),
                    },
                    "page": 0,
                    "per_page": 0
                }
            var url = appSettings.serverPath + appSettings.serviceApis.getDriversNotInGroup;
            services.funcPostRequest(url, vm.data).then(function(response) {
                $scope.driversList = response.data.drivers;
                vm.orders = $scope.driversList;
                console.log('vm.orders',vm.orders);
            }, function(error) {
                notify({ classes: 'alert-danger', message: error });
            });
        }
       vm.funcAddDriversToGroup = function(){
         //console.log(countriesConstant.groupId,vm.arrayOfDriverIds);
         vm.data =  {
            id: parseInt($stateParams.group_id),
            driver_ids: vm.arrayOfDriverIds
         }

          var url = appSettings.serverPath + appSettings.serviceApis.addDriversToGroup;
            services.funcPostRequest(url, { "group": vm.data}).then(function(response) {
                notify({ classes: 'alert-success', message: response.message });
                $state.go('app.custom-groups.create-groups');
            }, function(error) {
                notify({ classes: 'alert-danger', message: error });
            });
       }

        vm.getIndividualDriverDetails = function(driver_id){
            $state.go('app.custom-groups.single-driver', {"group_id":parseInt($stateParams.group_id),"driver_id":driver_id});
        }      

    })
