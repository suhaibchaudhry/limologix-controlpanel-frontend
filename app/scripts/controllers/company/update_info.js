'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:UpdateInfoCtrl
 * @description
 * # UpdateInfoCtrl
 * Controller of the minovateApp
 */
app
  .controller('UpdateInfoCtrl', ['$scope','$rootScope','$http','appSettings','$window','notify','Upload','$timeout',function ($scope,$rootScope,$http,appSettings,$window,notify,Upload,$timeout) {
    $scope.page = {
      title: 'Company Information',
      subtitle: ''//'Place subtitle here...'
    };

    $scope.phoneNumbr = /^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/;

    $scope.companyInfo = {
        name: '',
        email:'',
        primary_phone_number:'',
        logoUrl:'',
        secondary_phone_number:'',
        fax:'',
        street:'',
        city:'',
        zipcode:'',
        state_code:'',
        country_code:'',
        picFile:'',
        picFilePreview:''

    }
    // getCompanyInfo();
    // function getCompanyInfo(){
    //    var url = appSettings.serverPath + appSettings.serviceApis.company_info;
    //    $http.post(url,{"auth_token" : $window.sessionStorage['token']}).success( function(response) {
    //       //$state.go('app.company.details');         
    //       notify({ classes: 'alert-success',message:response.message});
    //    })
    //    .error(function(response,status){
    //         notify({ classes: 'alert-danger', message: response.message });
    //     });
    // }
   
    // function to submit the form after all validation has occurred
		$scope.submitForm = function(isValid,file) {
      // check to make sure the form is completely valid
      if (isValid) {
        // $rootScope.uploadedLogo =  $scope.companyInfo.picFilePreview;//$rootScope.logoUrl;
        // console.log('logooo', $scope.companyInfo.picFilePreview);
        var company = {};
          company.name = $scope.companyInfo.name;
          company.email = $scope.companyInfo.email;
          company.primary_phone_number = $scope.companyInfo.primary_phone_number;
          company.logo = file ? file :'';//$rootScope.uploadedLogo;
          company.secondary_phone_number = $scope.companyInfo.secondary_phone_number;
          company.fax = $scope.companyInfo.fax;
          company.address_attributes = {
            street:$scope.companyInfo.street,
            city:$scope.companyInfo.city,
            zipcode:$scope.companyInfo.zipcode,
            state_code:$scope.companyInfo.state_code,
            country_code:$scope.companyInfo.country_code
          }
        var userDetails = {
           "auth_token" : $window.sessionStorage['token'],
           "company": company
        }
      
       var url = appSettings.serverPath + appSettings.serviceApis.company_update;
       $http.post(url,userDetails).success( function(response) {
          //$state.go('app.company.details');         
          notify({ classes: 'alert-success',message:response.message});
       })
       .error(function(response,status){
            notify({ classes: 'alert-danger', message: response.message });
        });

			} else {
        console.log('form is invalid');
      }

		};
  }]);
