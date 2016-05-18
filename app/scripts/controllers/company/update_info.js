'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:UpdateInfoCtrl
 * @description
 * # UpdateInfoCtrl
 * Controller of the minovateApp
 */
app
  .controller('UpdateInfoCtrl', ['$scope','$rootScope','$http','appSettings','$window','notify','$timeout',function ($scope,$rootScope,$http,appSettings,$window,notify,$timeout) {
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
    //Get countries from API
    function getCountries(){
       var url = appSettings.serverPath + appSettings.serviceApis.company_getCountries;
        $http.post(url).success( function(response) {
            $scope.countries = response.data;
        });
    }
    //Get selected state from the view
    $scope.GetSelectedCountry = function (country_code) {
        var url = appSettings.serverPath + appSettings.serviceApis.company_getStates;
        $http.post(url,{'country_code':country_code }).success( function(response) {
            $scope.states = response.data;
         });          
    };

    $scope.GetSelectedState = function () {
        $scope.strState = document.getElementById("state_code").value;
    };

    getCompanyInfo();
    //Get company details from the service.
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
    //Convert image to base64 and send a request - For preview image.
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
    //Update company details
		$scope.submitForm = function(isValid) {
      if (isValid) {
        var imageUrl =  $scope.companyInfo.logo.image;
        toDataUrl(imageUrl, function(base64Img){
           // Base64DataURL
           $scope.base64Img = base64Img;
           $scope.logo_name = $rootScope.logoName ? $rootScope.logoName : $scope.companyInfo.logo.name;
           $scope.logo_image = $rootScope.logoUrl ? $rootScope.logoUrl: $scope.base64Img;
           var company = {
              name : $scope.companyInfo.name,
              email : $scope.companyInfo.email,
              primary_phone_number : $scope.companyInfo.primary_phone_number,
              logo : {
                name : logo_name,
                image : logo_image
              },
              secondary_phone_number : $scope.companyInfo.secondary_phone_number,
              fax : $scope.companyInfo.fax,
              address : {
                street:$scope.companyInfo.street,
                city:$scope.companyInfo.city,
                zipcode:$scope.companyInfo.zipcode,
                state_code:$scope.companyInfo.state_code,
                country_code:$scope.companyInfo.country_code
              }
            };
            var url = appSettings.serverPath + appSettings.serviceApis.company_update;
            $http.post(url,{"auth_token" : $window.sessionStorage['token'],"company": company})
            .success(function(response) {        
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
