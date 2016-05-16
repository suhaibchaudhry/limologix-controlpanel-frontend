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

   // getCompanyInfo();
    function getCompanyInfo(){
       if($window.sessionStorage['token']){
         var url = appSettings.serverPath + appSettings.serviceApis.company_info;
         var response1 = {"status":"success","message":"Company details updated successfully.",
         "data":{"company":{"id":2,"name":"dsad","logo":"/uploads/company/logo/2/certficate3.jpg",
         "email":"sadsad@vvc","primary_phone_number":"1231231234","secondary_phone_number":"1231231234","fax":"1231231234","address":{"street":"LNP","city":"Guntur","zipcode":522004,"state":"Alaska","country":"United States"}}}};
         var response = response1.data.company;
        // $http.post(url,{"auth_token" : $window.sessionStorage['token']}).success( function(response) {
            //var response = response.data;
            $scope.companyInfo = {
              name: response.name,
              email:response.email,
              primary_phone_number:response.primary_phone_number,
              logoUrl:response.logo,
              secondary_phone_number:response.secondary_phone_number,
              fax:response.fax,
              street:response.address.street,
              city:response.address.city,
              zipcode:response.address.zipcode,
              state_code: response.address.state,
              country_code:response.address.country,
              picFile:''
            }
  //           //$state.go('app.company.details');         
  //          // notify({ classes: 'alert-success',message:response.message});
  //        // })
  //        // .error(function(response,status){
  //        //      //notify({ classes: 'alert-danger', message: response.message });
  //        //  });
        
        }
       }
    
      $scope.uploadFile = function(files) {
      //Take the first selected file
      $scope.logoImage = files;
     
     

  };

   
  //   // function to submit the form after all validation has occurred
		$scope.submitForm = function(isValid) {
      if (isValid) {
        var company = {};
          company.name = $scope.companyInfo.name;
          company.email = $scope.companyInfo.email;
          company.primary_phone_number = $scope.companyInfo.primary_phone_number;

           var fd = new FormData();
          console.log('file upload',fd);
          fd.append("file",$scope.logoImage );


          company.logo = fd;//$rootScope.uploadedLogo;
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
           //"auth_token" : $window.sessionStorage['token'],
           "company": company
        }
      
       var url = appSettings.serverPath + appSettings.serviceApis.company_update;
       $http.post(url,{"auth_token" : $window.sessionStorage['token'],"company": company}
       //{
          //headers: {'Content-Type': 'multipart/form-data' }
       // }
        ).success( function(response) {
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
