'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:CustomGroupsCtrl
 * @description
 * # CustomGroupsCtrl
 * Controller of the minovateApp
 */
app
    .controller('CustomGroupsCtrl', ['$scope','$rootScope','notify','appSettings','services','$state',
    function($scope,$rootScope,notify,appSettings,services,$state) {
        $scope.page = {
            title: 'Create Groups',
            subtitle: '',//'Place subtitle here...'
        };
        $scope.toggle = false;
       
       
       
//         funcGetCustomGroupsList();
//         function funcGetCustomGroupsList(){
//             var url = appSettings.serverPath + appSettings.serviceApis.getCustomGroups;
//                 services.funcPostRequest(url, {"page": 0,"per_page": 0}).then(function(response) {
//                    if(response.data)
//                      $scope.groupslist = response.data.groups;
                      
//                    //notify({ classes: 'alert-success', message: response.message });
//                 }, function(error) {
//                     notify({ classes: 'alert-danger', message: error });
//                 });
//                 //funcGetCustomGroupsList();
//         }

//         $scope.AddDriversToGroup = function(groupId){
//              $rootScope.selectedGroupId = groupId;
//              $state.go('app.custom-groups.create-groups-drivers');
//         }
    }])
    .controller('GroupsTableCustomGroupCtrl', function($scope, $rootScope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $resource, $state, $http, appSettings, notify, $window, services) {
       
        var vm = this;
        vm.orders = [];
        vm.addDriversToGroupBtn = false;
        getGroupslist();
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
            DTColumnDefBuilder.newColumnDef(3).notSortable()
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
        

         vm.CreateBucket = function(){
            $scope.group = {
                "name": $scope.title,
                "description":  $scope.Description
            }
            var url = appSettings.serverPath + appSettings.serviceApis.createCustomGroup;
                services.funcPostRequest(url, { 'group': $scope.group }).then(function(response) {
                   notify({ classes: 'alert-success', message: response.message });
                  $scope.toggle = false;
                  getGroupslist();
                  //location.reload();
                 // funcGetCustomGroupsList();
                 
                }, function(error) {
                    notify({ classes: 'alert-danger', message: error });
                });
        }


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

        function getGroupslist() {
            var url = appSettings.serverPath + appSettings.serviceApis.getCustomGroups;
            services.funcPostRequest(url, { "page": '0', "per_page": '0' }).then(function(response) {
                if( response.data){
                 $scope.driversList = response.data.groups;
                 vm.groups = $scope.driversList;
                 console.log('vm.groups',vm.groups);       
                }
                
            }, function(error) {
                notify({ classes: 'alert-danger', message: error });
            });
        }
        
         vm.getGroupslist = function() {
            var url = appSettings.serverPath + appSettings.serviceApis.getCustomGroups;
            services.funcPostRequest(url, { "page": '0', "per_page": '0' }).then(function(response) {
                if( response.data){
                 $scope.driversList = response.data.groups;
                 vm.groups = $scope.driversList;
                // location.reload();
                 console.log('vm.groups',vm.groups);       
                }
                
            }, function(error) {
                notify({ classes: 'alert-danger', message: error });
            });
        }


       vm.funcAddDriversToGroup = function(){
         console.log($rootScope.selectedGroupId,vm.arrayOfDriverIds);
         vm.data =  {
            id: $rootScope.selectedGroupId,
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

        vm.getIndividualGroupDetails = function(group_id) {
                $state.go('app.custom-groups.groups-view', { "group_id": group_id });
                //countriesConstant.groupId = group_id;
            }

        vm.AddDrivers = function(group_id){
            $state.go('app.custom-groups.create-groups-drivers',{"group_id" : group_id});
        }   

        
         //function to delete groups
            vm.funcDeleteGroup = function(del_gId) {
                swal({
                    title: "Are you sure?",
                    text: "You want to remove this group?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, remove it!",
                    closeOnConfirm: false
                }, function(isConfirm) {
                    if (!isConfirm) return;
                    

                    vm.group = {
                        "id": del_gId,
                    }
                    var url = appSettings.serverPath + appSettings.serviceApis.deleteGroup;
                    services.funcPostRequest(url, { "group": vm.group }).then(function(response) {
                        //notify({ classes: 'alert-success', message: response.message });
                        swal("Done!", "It was succesfully deleted!", "success");
                       // location.reload();
                        $state.go('app.custom-groups.create-groups');
                    }, function(error) {
                        swal("Error deleting!", "Please try again", "error");
                        //notify({ classes: 'alert-danger', message: error });
                    });
                });
            }

          

    })

