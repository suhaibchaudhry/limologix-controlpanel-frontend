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
    $scope.base64Img = '';
    $scope.phoneNumbr = /^\+?\d{1}[- ]?\d{3}[- ]?\d{3}[- ]?\d{4}$/;

    $scope.companyInfo = {
        name: '',
        email:'',
        primary_phone_number:'',
        logo:{
          name:'',
          image:''
        },
        secondary_phone_number:'',
        fax:'',
        street:'',
        city:'',
        zipcode:'',
        state_code:'',
        country_code:'',
        picFile:''
    }

    getCountries();
    function getCountries(){
       var url = appSettings.serverPath + appSettings.serviceApis.company_getCountries;
        $http.post(url).success( function(response) {
            $scope.countries = response.data;
        });
    }

    $scope.GetSelectedCountry = function (country_code) {
        var url = appSettings.serverPath + appSettings.serviceApis.company_getStates;
        $http.post(url,{'country_code':country_code }).success( function(response) {
            $scope.states = response.data;
         });  
        $
    };

    $scope.GetSelectedState = function () {
        $scope.strState = document.getElementById("state_code").value;
    };

    getCompanyInfo();
    function getCompanyInfo(){

       if($window.sessionStorage['token']){
         var url = appSettings.serverPath + appSettings.serviceApis.company_info;
         $http.post(url,{"auth_token" : $window.sessionStorage['token']}).success( function(response) {
          var response = response.data.company;


            $scope.companyInfo = {
              name: response.name,
              email:response.email,
              primary_phone_number:response.primary_phone_number,
              logo:{
                name: response.logo.name,
                image: appSettings.server_address+response.logo.image
              },
              secondary_phone_number:response.secondary_phone_number,
              fax:response.fax,
              street:response.address? response.address.street :'',
              city:response.address ? response.address.city : '',
              zipcode:response.address ? response.address.zipcode : '',
              state_code: response.address ? response.address.state :'',
              country_code:response.address ? response.address.country :''
            }
          });
       }
     }
    function toDataUrl(url, callback){
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function() {
          var reader  = new FileReader();
          reader.onloadend = function () {
              callback(reader.result);
          }
          reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.send();
    }
       
      $scope.uploadFile = function(files) {
      //Take the first selected file
      $scope.logoImage = files;
     
     

  };

   
  //   // function to submit the form after all validation has occurred
		$scope.submitForm = function(isValid) {
      if (isValid) {
        
        var imageUrl =  $scope.companyInfo.logo.image;
        toDataUrl(imageUrl, function(base64Img){
        // Base64DataURL
           $scope.base64Img = base64Img;

            var company = {};
          company.name = $scope.companyInfo.name;
          company.email = $scope.companyInfo.email;
          company.primary_phone_number = $scope.companyInfo.primary_phone_number;
          company.logo = {};
          company.logo.name = $rootScope.logoName ? $rootScope.logoName : $scope.companyInfo.logo.name ;

          company.logo.image = $rootScope.logoUrl ? $rootScope.logoUrl: $scope.base64Img;
          
          company.secondary_phone_number = $scope.companyInfo.secondary_phone_number;
          company.fax = $scope.companyInfo.fax;
          company.address = {
            street:$scope.companyInfo.street,
            city:$scope.companyInfo.city,
            zipcode:$scope.companyInfo.zipcode,
            state_code:$scope.companyInfo.state_code,
            country_code:$scope.companyInfo.country_code
          }
           var userDetails = {
           "company": company
          }
              var url = appSettings.serverPath + appSettings.serviceApis.company_update;
             $http.post(url,{"auth_token" : $window.sessionStorage['token'],"company": company}
             // {
             //    headers: {'Content-Type': 'multipart/form-data' }
             // }
              ).success( function(response) {
                //$state.go('app.company.details');         
                notify({ classes: 'alert-success',message:response.message});
             })
             .error(function(response,status){
                  notify({ classes: 'alert-danger', message: response.message });
              });
        });  
       

			} else {
        console.log('form is invalid');
      }

		};
  }]);
