'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:FileUploadCtrl
 * @description
 * # FileUploadCtrl
 * Controller of the minovateApp
 */
app
    .controller('FileUploadCtrl', [
        "$scope",
        "$rootScope",
        "appSettings",
        "services",
        "notify",
        function($scope, $rootScope, appSettings,services,notify) {
            $scope.page = {
                title: 'Free_ads',
                subtitle: '', //'Place subtitle here...'
            };
            //File uploads for Licence plate and ARA photos.
            $scope.uploadAds = function() {
                $("input[id='inputfilem']").click();
            }
            $scope.imgsArr = [];
            $scope.imagePath = appSettings.server_images_path;

            displayAds();

            function displayAds() {
                var eachImgArr = [];
                $scope.imgsArr = [];
                var url = appSettings.serverPath + appSettings.serviceApis.displayAdvertisements;
                services.funcPostRequest(url, { "page": 0, "per_page": 0 }).then(function(response) {
                    $scope.adsJSON = response.data.advertisements;
                    if( $scope.adsJSON){
                        for (var i = 0; i < Object.keys($scope.adsJSON).length; i++) {
                            var imgs = $scope.adsJSON[i].poster.image;
                            var imgName = $scope.adsJSON[i].poster.name;
                            var ids = $scope.adsJSON[i].id;
                            var singleAd = {
                                name: imgName,
                                image: imgs,
                                id:ids
                            }
                            eachImgArr.push(singleAd);
                            $scope.imgsArr[i] = eachImgArr[i];
                        }
                    }
                    
                    //notify({ classes: 'alert-success', message: response.message });
                }, function(error) {
                    notify({ classes: 'alert-danger', message: error });
                });

            }
            $scope.submitImg = function(form) {
                var namesArr = $rootScope.fileNamesArr;
                var imgsArr = $scope.formImages;
                var obj = {}
                var freeAds = [];

                $.each(imgsArr, function(i, val) {
                    obj[namesArr[i]] = val;
                    var singleAd = {
                        name: namesArr[i],
                        image: val
                    }
                    freeAds.push(singleAd)
                });

                $scope.posters = freeAds;
                // alert($scope.posters.name);
                var url = appSettings.serverPath + appSettings.serviceApis.createAdvertisements;
                services.funcPostRequest(url, { "posters": $scope.posters }).then(function(response) {
                    $scope.posters = [];
                    $scope.formImages = [];
                    notify({ classes: 'alert-success', message: response.message });
                    displayAds();
                }, function(error) {
                    notify({ classes: 'alert-danger', message: error });
                });
            };
             $scope.removeAd = function(id_num) {
                $scope.advertisement = {
                    "id": id_num
                }
                var url = appSettings.serverPath + appSettings.serviceApis.deleteAdvertisements;
                services.funcPostRequest(url, { "advertisement":{"id": $scope.advertisement.id }}).then(function(response) {
                    notify({ classes: 'alert-success', message: response.message });
                    displayAds();
                }, function(error) {
                    notify({ classes: 'alert-danger', message: error });
                });
            }
        }
    ])

.directive('imageReader', function($q, $rootScope) {
    var slice = Array.prototype.slice;
    var fileNamesArr = [];

    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            if (!ngModel) return;

            ngModel.$render = function() {};

            element.bind('change', function(e) {
                var element = e.target;
                $rootScope.fileNamesArr = [];
                fileNamesArr = [];

                $.each(element.files, function(key, value) {

                    fileNamesArr.push(value.name);
                    $rootScope.fileNamesArr = fileNamesArr;
                });

                $q.all(slice.call(element.files, 0).map(readFile))
                    .then(function(values) {
                        if (element.multiple) ngModel.$setViewValue(values);
                        else ngModel.$setViewValue(values.length ? values[0] : null);
                    });

                function readFile(file) {
                    var deferred = $q.defer();

                    var reader = new FileReader();
                    reader.onload = function(e) {
                        deferred.resolve(e.target.result);
                    };
                    reader.onerror = function(e) {
                        deferred.reject(e);
                    };
                    reader.readAsDataURL(file);

                    return deferred.promise;
                }
            });
        }
    };
});
