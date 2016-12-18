'use strict';

/**
 * @ngdoc overview
 * @name limoLogixApp
 * @description
 * # limoLogixApp
 *
 * Main module of the application.
 */

/*jshint -W079 */
var app = angular
    .module('limoLogixApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngTouch',
        'ngMessages',
        'picardy.fontawesome',
        'ui.bootstrap',
        'ui.router',
        'ui.utils',
        'angular-loading-bar',
        'angular-momentjs',
        'FBAngular',
        'lazyModel',
        'toastr',
        'angularBootstrapNavTree',
        'oc.lazyLoad',
        'ui.select',
        'ui.tree',
        'textAngular',
        'colorpicker.module',
        'angularFileUpload',
        'ngImgCrop',
        'datatables',
        'datatables.bootstrap',
        'datatables.colreorder',
        'datatables.colvis',
        'datatables.tabletools',
        'datatables.scroller',
        'datatables.columnfilter',
        'ui.grid',
        'ui.grid.resizeColumns',
        'ui.grid.edit',
        'ui.grid.moveColumns',
        'ngTable',
        'smart-table',
        'angular-flot',
        'angular-rickshaw',
        'easypiechart',
        'uiGmapgoogle-maps',
        'ui.calendar',
        'ngTagsInput',
        'pascalprecht.translate',
        'ngMaterial',
        'localytics.directives',
        'leaflet-directive',
        'wu.masonry',
        'ipsum',
        'angular-intro',
        'dragularModule',
        'cgNotify',
        'ngFileUpload',
        'vsGoogleAutocomplete',
        'angularjs-dropdown-multiselect'
    ])
    .constant('appSettings', {
        server_address: "http://limologix.softwaystaging.com/", //'http://172.16.10.212:9000',
        server_images_path: "http://limologix.api.softwaystaging.com/",//'http://172.16.10.212:9000',
        version: 'v1',
        serverPath: "http://limologix.api.softwaystaging.com/api/v1/", //'http://172.16.10.212:9000/api/v1/',
        FayeServerUrl:'http://limologix.softwaystaging.com:9292/faye', //'http://172.16.10.212:9292/faye',
        serviceApis: {
            signin: 'users/sign_in',
            registration: 'users/registration',
            companyChannel: 'users/companies/channel',
            //Company settings
            company_update: 'users/companies/update',
            company_info: 'users/companies/show',
            company_getCountries: 'master_data/countries',
            company_getStates: 'master_data/states',
            //Dispatch requests
            addcustomer: 'users/customers/create',
            getExistingCustomers: '/users/customers/search',
            createTrip: 'users/trips/create',
            tripSummary: 'users/trips/show',
            tripUpdate: 'users/trips/update',
            selectVehicleType: 'master_data/vehicles/types',
            tripPending: 'users/trips/index',
            my_profile: 'users/profile/show',
            tripCreate: 'users/trips/create',
            profileupdate: 'users/profile/update',
            //Advertisements
            createAdvertisements: 'users/advertisements/create',
            displayAdvertisements: 'master_data/advertisements',
            deleteAdvertisements: 'users/advertisements/delete',
            //Custom Groups
            createCustomGroup: 'users/groups/create',
            addDriversToGroup: 'users/groups/add_drivers',
            getCustomGroups: 'users/groups/index',
            getDriversNotInGroup: 'users/groups/get_drivers_not_in_group',
            getDrivers: 'users/groups/get_drivers',
            deleteGroup: 'users/groups/delete',
            RemoveDrivers: 'users/groups/remove_drivers',
            //notifications
            getNotifications:'users/notifications/index',
            updateNotifications : 'users/notifications/update_status',
            //my-account
            reset_auth_details: 'users/profile/reset_authentication_details',
            restpasswrdfromemail: 'users/reset_password',
            forgotPassword: 'users/forgot_password',
            logout: 'users/logout',
            //super-admin
            getDriverList: 'users/drivers/index',
            tripcancel:'users/trips/cancel',
            getIndividualDriverDetail: 'users/drivers/show',
            userApprove: 'users/drivers/approve',
            userBlock: 'users/drivers/block',
            userDisapprove: 'users/drivers/disapprove'
        }
    })

.run(['$rootScope', '$state', '$http', '$stateParams', '$window', 'countriesConstant','notify',function($rootScope, $state, $http, $stateParams, $window, constant,notify) {
    //If user logged in  - Admin or Super Admin

    notify.config({duration:1000});

    var user = $window.sessionStorage['user'] ? JSON.parse($window.sessionStorage['user']) : {};
    var userrole = user['role'];
    if (userrole) {
        constant.userRole = userrole;
    }

    if (user['Auth-Token']) {
        constant.user = user;
    } else {
        constant.user = {};
    }
    //sets token on evry refresh
    if (constant.user['Auth-Token']) {
        $http.defaults.headers.common['Auth-Token'] = $window.sessionStorage['Auth-Token'];
    } else {
        clearInterval($rootScope.notificationTimer);
        $state.go('core.login')
    }


    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$on('$stateChangeSuccess', function(event, toState) {

        event.targetScope.$watch('$viewContentLoaded', function() {

            angular.element('html, body, #content').animate({ scrollTop: 0 }, 200);

            setTimeout(function() {
                angular.element('#wrap').css('visibility', 'visible');

                if (!angular.element('.dropdown').hasClass('open')) {
                    angular.element('.dropdown').find('>ul').slideUp();
                }
            }, 200);
        });
        $rootScope.containerClass = toState.containerClass;
    });
}])

.config(['uiSelectConfig',function(uiSelectConfig) {
    uiSelectConfig.theme = 'bootstrap';

}])

//angular-language
.config(['$translateProvider', '$httpProvider', function($translateProvider, $httpProvider) {
        $translateProvider.useStaticFilesLoader({
            prefix: 'languages/',
            suffix: '.json'
        });
        $translateProvider.useLocalStorage();
        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy(null);
        //capture the response and process it before completing the call
        $httpProvider.interceptors.push('authHttpResponseInterceptor');

//         var spinnerFuction = function spinnerFuction(data,headersGetter){
//             $('#spinner').show();
//         }

//         $httpProvider.defaults.transformRequest.push(spinnerFuction);
    }])
    //session expired
    .factory('authHttpResponseInterceptor', ['$q', '$location', function($q, $location) {
        return {
            response: function(response) {
                if (response.status === 401 || response.status === -1) {
                    //notify({ classes: 'alert-success', message: "Session expired" });
                    $location.url('/login');
                }
                return response || $q.when(response);
            },
            responseError: function(rejection) {
                if (rejection.status === 401 || rejection.status === -1) {
                    $location.url('/login');
                }
                return $q.reject(rejection);
            }
        }
    }])
    .factory('Faye', ['$window', 'appSettings', function($window, appSettings) {
        var Logger = {
            incoming: function(message, callback) {
                //console.log('incoming', message);
                callback(message);
            },
            outgoing: function(message, callback) {
                message.ext = message.ext || {};
               // message.ext.auth_token = $window.sessionStorage['Auth-Token'] ? $window.sessionStorage['Auth-Token'] : '';
                message.ext.user_type = "driver";
                //console.log('outgoing', message);
                callback(message);
            }
        };

        var FayeServerURL = appSettings.FayeServerUrl;
        var client = new Faye.Client(FayeServerURL);
        client.addExtension(Logger);
        // toast_notification.openToast();
        return {
            getClient: function() {
                return client;
            },
            publish: function(channel, message) {
                client.publish(channel, message);
            },

            subscribe: function(channel, callback) {
                client.subscribe(channel, callback);
            }
        }

    }])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
        // use the HTML5 History API
        //$locationProvider.html5Mode(true);

              $urlRouterProvider.otherwise('/core/login');

        $stateProvider

            .state('app', {
                abstract: true,
                url: '/app',
                templateUrl: 'views/tmpl/app.html'
            })
            //dashboard
            .state('app.dashboard', {
                url: '/dashboard',
                controller: 'DashboardCtrl',
                templateUrl: 'views/tmpl/dashboard.html',
                resolve: {
                    plugins: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'scripts/vendor/datatables/datatables.bootstrap.min.css',
                            'scripts/vendor/datatables/datatables.bootstrap.min.css'
                        ]);
                    }]
                }
            })

        //mail
        .state('app.mail', {
                abstract: true,
                url: '/mail',
                controller: 'MailCtrl',
                templateUrl: 'views/tmpl/mail/mail.html'
            })
            //mail/inbox
            .state('app.mail.inbox', {
                url: '/inbox',
                controller: 'MailInboxCtrl',
                templateUrl: 'views/tmpl/mail/inbox.html'
            })
            //mail/compose
            .state('app.mail.compose', {
                url: '/compose',
                controller: 'MailComposeCtrl',
                templateUrl: 'views/tmpl/mail/compose.html'
            })
            //mail/single
            .state('app.mail.single', {
                url: '/single',
                controller: 'MailSingleCtrl',
                templateUrl: 'views/tmpl/mail/single.html'
            })
            //ui
            .state('app.ui', {
                url: '/ui',
                template: '<div ui-view></div>'
            })
            //ui/typography
            .state('app.ui.typography', {
                url: '/typography',
                controller: 'TypographyCtrl',
                templateUrl: 'views/tmpl/ui/typography.html',
                resolve: {
                    plugins: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'scripts/vendor/google-code-prettify/prettify.css',
                            'scripts/vendor/google-code-prettify/sons-of-obsidian.css',
                            'scripts/vendor/google-code-prettify/prettify.js'
                        ]);
                    }]
                }
            })
            //ui/lists
            .state('app.ui.lists', {
                url: '/lists',
                controller: 'ListsCtrl',
                templateUrl: 'views/tmpl/ui/lists.html'
            })
            //ui/buttons&icons
            .state('app.ui.buttons-icons', {
                url: '/buttons-icons',
                controller: 'ButtonsIconsCtrl',
                templateUrl: 'views/tmpl/ui/buttons-icons.html'
            })
            //ui/navs&accordions
            .state('app.ui.navs', {
                url: '/navs',
                controller: 'NavsCtrl',
                templateUrl: 'views/tmpl/ui/navs.html'
            })
            //ui/modals
            .state('app.ui.modals', {
                url: '/modals',
                controller: 'ModalsCtrl',
                templateUrl: 'views/tmpl/ui/modals.html'
            })
            //ui/tiles
            .state('app.ui.tiles', {
                url: '/tiles',
                controller: 'TilesCtrl',
                templateUrl: 'views/tmpl/ui/tiles.html'
            })
            //ui/portlets
            .state('app.ui.portlets', {
                url: '/portlets',
                controller: 'PortletsCtrl',
                templateUrl: 'views/tmpl/ui/portlets.html'
            })
            //ui/grid
            .state('app.ui.grid', {
                url: '/grid',
                controller: 'GridCtrl',
                templateUrl: 'views/tmpl/ui/grid.html'
            })
            //ui/widgets
            .state('app.ui.widgets', {
                url: '/widgets',
                controller: 'WidgetsCtrl',
                templateUrl: 'views/tmpl/ui/widgets.html'
            })
            //ui/alerts & notifications
            .state('app.ui.alerts', {
                url: '/alerts',
                controller: 'AlertsCtrl',
                templateUrl: 'views/tmpl/ui/alerts.html'
            })
            //ui/general
            //         .state('app.ui.general', {
            //             url: '/general',
            //             controller: 'GeneralCtrl',
            //             templateUrl: 'views/tmpl/ui/general.html'
            //         })
            //ui/tree
            .state('app.ui.tree', {
                url: '/tree',
                controller: 'TreeCtrl',
                templateUrl: 'views/tmpl/ui/tree.html'
            })
            //ui/masonry
            .state('app.ui.masonry', {
                url: '/masonry',
                controller: 'UiMasonryCtrl',
                templateUrl: 'views/tmpl/ui/masonry.html'
            })
            //ui/dragula
            .state('app.ui.dragula', {
                url: '/dragula',
                controller: 'UiDragulaCtrl',
                templateUrl: 'views/tmpl/ui/dragula.html'
            })
            //material
            .state('app.material', {
                url: '/material',
                template: '<div ui-view></div>'
            })
            //material/autocomplete
            .state('app.material.autocomplete', {
                url: '/autocomplete',
                controller: 'mtAutocompleteCtrl',
                templateUrl: 'views/tmpl/material/autocomplete.html'
            })
            //material/bottom-sheet
            .state('app.material.bottom-sheet', {
                url: '/bottom-sheet',
                controller: 'mtBottomSheetCtrl',
                templateUrl: 'views/tmpl/material/bottom-sheet.html'
            })
            //material/buttons
            .state('app.material.buttons', {
                url: '/buttons',
                controller: 'mtButtonsCtrl',
                templateUrl: 'views/tmpl/material/buttons.html'
            })
            //material/cards
            .state('app.material.cards', {
                url: '/cards',
                controller: 'mtCardsCtrl',
                templateUrl: 'views/tmpl/material/cards.html'
            })
            //material/checkbox
            .state('app.material.checkbox', {
                url: '/checkbox',
                controller: 'mtCheckboxCtrl',
                templateUrl: 'views/tmpl/material/checkbox.html'
            })
            //material/chips
            .state('app.material.chips', {
                url: '/chips',
                controller: 'mtChipsCtrl',
                templateUrl: 'views/tmpl/material/chips.html'
            })
            //material/content
            .state('app.material.content', {
                url: '/content',
                controller: 'mtContentCtrl',
                templateUrl: 'views/tmpl/material/content.html'
            })
            //material/dialog
            .state('app.material.dialog', {
                url: '/dialog',
                controller: 'mtDialogCtrl',
                templateUrl: 'views/tmpl/material/dialog.html'
            })
            //material/divider
            .state('app.material.divider', {
                url: '/divider',
                controller: 'mtDividerCtrl',
                templateUrl: 'views/tmpl/material/divider.html'
            })
            //material/fab-speed-dial
            .state('app.material.fab-speed-dial', {
                url: '/fab-speed-dial',
                controller: 'mtFabSpeedDialCtrl',
                templateUrl: 'views/tmpl/material/fab-speed-dial.html'
            })
            //material/fab-toolbar
            .state('app.material.fab-toolbar', {
                url: '/fab-toolbar',
                controller: 'mtFabToolbarCtrl',
                templateUrl: 'views/tmpl/material/fab-toolbar.html'
            })
            //material/grid-list
            .state('app.material.grid-list', {
                url: '/grid-list',
                controller: 'mtGridListCtrl',
                templateUrl: 'views/tmpl/material/grid-list.html'
            })
            //material/inputs
            .state('app.material.inputs', {
                url: '/inputs',
                controller: 'mtInputsCtrl',
                templateUrl: 'views/tmpl/material/inputs.html'
            })
            //material/list
            .state('app.material.list', {
                url: '/list',
                controller: 'mtListCtrl',
                templateUrl: 'views/tmpl/material/list.html'
            })
            //material/menu
            .state('app.material.menu', {
                url: '/menu',
                controller: 'mtMenuCtrl',
                templateUrl: 'views/tmpl/material/menu.html'
            })
            //material/progress-circular
            .state('app.material.progress-circular', {
                url: '/progress-circular',
                controller: 'mtProgressCircularCtrl',
                templateUrl: 'views/tmpl/material/progress-circular.html'
            })
            //material/progress-linear
            .state('app.material.progress-linear', {
                url: '/progress-linear',
                controller: 'mtProgressLinearCtrl',
                templateUrl: 'views/tmpl/material/progress-linear.html'
            })
            //material/radio-button
            .state('app.material.radio-button', {
                url: '/radio-button',
                controller: 'mtRadioButtonCtrl',
                templateUrl: 'views/tmpl/material/radio-button.html'
            })
            //material/select
            .state('app.material.select', {
                url: '/select',
                controller: 'mtSelectCtrl',
                templateUrl: 'views/tmpl/material/select.html'
            })
            //material/sidenav
            .state('app.material.sidenav', {
                url: '/sidenav',
                controller: 'mtSidenavCtrl',
                templateUrl: 'views/tmpl/material/sidenav.html'
            })
            //material/slider
            .state('app.material.slider', {
                url: '/slider',
                controller: 'mtSliderCtrl',
                templateUrl: 'views/tmpl/material/slider.html'
            })
            //material/subheader
            .state('app.material.subheader', {
                url: '/subheader',
                controller: 'mtSubheaderCtrl',
                templateUrl: 'views/tmpl/material/subheader.html'
            })
            //material/swipe
            .state('app.material.swipe', {
                url: '/swipe',
                controller: 'mtSwipeCtrl',
                templateUrl: 'views/tmpl/material/swipe.html'
            })
            //material/switch
            .state('app.material.switch', {
                url: '/switch',
                controller: 'mtSwitchCtrl',
                templateUrl: 'views/tmpl/material/switch.html'
            })
            //material/tabs
            .state('app.material.tabs', {
                url: '/tabs',
                controller: 'mtTabsCtrl',
                templateUrl: 'views/tmpl/material/tabs.html'
            })
            //material/toast
            .state('app.material.toast', {
                url: '/toast',
                controller: 'mtToastCtrl',
                templateUrl: 'views/tmpl/material/toast.html'
            })
            //material/toolbar
            .state('app.material.toolbar', {
                url: '/toolbar',
                controller: 'mtToolbarCtrl',
                templateUrl: 'views/tmpl/material/toolbar.html'
            })
            //material/tooltip
            .state('app.material.tooltip', {
                url: '/tooltip',
                controller: 'mtTooltipCtrl',
                templateUrl: 'views/tmpl/material/tooltip.html'
            })
            //material/whiteframe
            .state('app.material.whiteframe', {
                url: '/whiteframe',
                controller: 'mtWhiteframeCtrl',
                templateUrl: 'views/tmpl/material/whiteframe.html'
            })


        //forms
        .state('app.company', {
            url: '/company',
            template: '<div ui-view></div>'
        })

        //forms/wizard
            .state('app.company.details', {
                url: '/details',
                controller: 'UpdateInfoCtrl',
                templateUrl: 'views/tmpl/company/update_company_info.html'
            })

            .state('app.dispatch', {
                url: '/dispatches',
                template: '<div ui-view></div>'
            })
            //create trip
            .state('app.dispatch.dispatch_ride_request', {
                url: '/dispatch_ride_request',
                controller: 'DispatchRideRequestCtrl',
                templateUrl: 'views/tmpl/dispatch/dispatch_ride_request.html'
            })
             //cancel trip
            .state('app.dispatch.cancel_ride_request', {
                url: '/cancel_ride_request',
                controller: 'CancelRideRequestCtrl',
                templateUrl: 'views/tmpl/dispatch/cancel_ride_request.html'
            })
            // Dispatches/Available dispatches
             .state('app.dispatch.availabledispatches', {
                url: '/available_trips',
                controller: 'AvailableDispatchesCtrl',
                templateUrl: 'views/tmpl/dispatch/available_dispatches.html',
                resolve: {
                    plugins: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'scripts/vendor/datatables/datatables.bootstrap.min.css',
                            'scripts/vendor/datatables/Pagination/input.js',
                            'scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js'
                        ]);
                    }]
                }
            })
            // Dispatches/single-avaliable-dispatches
            .state('app.dispatch.single-availabledispatches', {
                url: '/single-avaliable-dispatches/:trip_id',
                controller: 'SingleAvailableDispatchCtrl',
                templateUrl: 'views/tmpl/dispatch/single_available_dispatches.html',
                resolve: {
                    plugins: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'scripts/vendor/datatables/datatables.bootstrap.min.css',
                            'scripts/vendor/datatables/Pagination/input.js',
                            'scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js'
                        ]);
                    }]
                }
            })
            // Dispatches/Pending dispatches
            .state('app.dispatch.pendingdispatches', {
                url: '/pending_dispatches',
                controller: 'PendingDispatchesCtrl',
                templateUrl: 'views/tmpl/dispatch/pending_dispatches.html',
                resolve: {
                    plugins: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'scripts/vendor/datatables/datatables.bootstrap.min.css',
                            'scripts/vendor/datatables/Pagination/input.js',
                            'scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js'
                        ]);
                    }]
                }
            })
            // Dispatches/single_pending_dispatches
            .state('app.dispatch.single-pendingdispatches', {
                url: '/single-pending-dispatches/:trip_id',
                controller: 'SinglePendingDispatchCtrl',
                templateUrl: 'views/tmpl/dispatch/single_pending_dispatches.html',
                resolve: {
                    plugins: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'scripts/vendor/datatables/datatables.bootstrap.min.css',
                            'scripts/vendor/datatables/Pagination/input.js',
                            'scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js'
                        ]);
                    }]
                }
            })
            //Dispatches/active dispatches
            .state('app.dispatch.activedispatches', {
                url: '/active_dispatches',
                controller: 'ActiveDispatchesCtrl',
                templateUrl: 'views/tmpl/dispatch/active_dispatches.html',
                resolve: {
                    plugins: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'scripts/vendor/datatables/datatables.bootstrap.min.css',
                            'scripts/vendor/datatables/Pagination/input.js',
                            'scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js'
                        ]);
                    }]
                }
            })
            //dispatches/single-activedispatches
            .state('app.dispatch.single-activedispatches', {
                url: '/single-active-dispatches/:trip_id',
                controller: 'SingleActiveDispatchCtrl',
                templateUrl: 'views/tmpl/dispatch/single_active_dispatches.html',
                resolve: {
                    plugins: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'scripts/vendor/datatables/datatables.bootstrap.min.css',
                            'scripts/vendor/datatables/Pagination/input.js',
                            'scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js'
                        ]);
                    }]
                }
            })
            //dispatches/inactivedispatches
            .state('app.dispatch.inactivedispatches', {
                url: '/inactive_dispatches',
                controller: 'InactiveDispatchesCtrl',
                templateUrl: 'views/tmpl/dispatch/inactive_dispatches.html',
                resolve: {
                    plugins: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'scripts/vendor/datatables/datatables.bootstrap.min.css',
                            'scripts/vendor/datatables/Pagination/input.js',
                            'scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js'
                        ]);
                    }]
                }
            })
            //dispatches/single_inactive_dispatches
            .state('app.dispatch.single-inactivedispatches', {
                url: '/single-inactive-dispatches/:trip_id',
                controller: 'SingleInactiveDispatchCtrl',
                templateUrl: 'views/tmpl/dispatch/single_inactive_dispatches.html',
                resolve: {
                    plugins: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'scripts/vendor/datatables/datatables.bootstrap.min.css',
                            'scripts/vendor/datatables/Pagination/input.js',
                            'scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js'
                        ]);
                    }]
                }
            })

            .state('app.dispatch.completeddispatches', {
                url: '/completed_dispatches',
                controller: 'CompletedDispatchesCtrl',
                templateUrl: 'views/tmpl/dispatch/completed_dispatches.html',
                resolve: {
                    plugins: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'scripts/vendor/datatables/datatables.bootstrap.min.css',
                            'scripts/vendor/datatables/Pagination/input.js',
                            'scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js'
                        ]);
                    }]
                }
            })
            .state('app.dispatch.drivermap', {
                url: '/drivermap',
                controller: 'DriverMapCtrl',
                templateUrl: 'views/tmpl/dispatch/drivermap.html',
                resolve: {
                    plugins: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'scripts/vendor/datatables/datatables.bootstrap.min.css',
                            'scripts/vendor/datatables/Pagination/input.js',
                            'scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js'
                        ]);
                    }]
                }
            })
            .state('app.dispatch.single-completeddispatches', {
                url: '/single-completed-dispatches/:trip_id',
                controller: 'SingleCompletedDispatchCtrl',
                templateUrl: 'views/tmpl/dispatch/single_completed_dispatches.html',
                resolve: {
                    plugins: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'scripts/vendor/datatables/datatables.bootstrap.min.css',
                            'scripts/vendor/datatables/Pagination/input.js',
                            'scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js'
                        ]);
                    }]
                }
            })


            .state('app.custom-groups', {
                url: '/custom-groups',
                template: '<div ui-view></div>'
            })

        //create groups/custom-group-create
        .state('app.custom-groups.create-groups', {
            url: '/create_groups',
            controller: 'CustomGroupsCtrl',
            templateUrl: 'views/tmpl/custom_group/create_groups/custom-group-create.html',
            resolve: {
                plugins: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'scripts/vendor/datatables/datatables.bootstrap.min.css',
                        'scripts/vendor/datatables/Pagination/input.js',
                        'scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js'
                    ]);
                }]
            }
        })

         //create groups/custom-group-view
        .state('app.custom-groups.groups-view', {
            url: '/groups_view/:group_id',
            controller: 'CustomGroupInfoDriversCtrl',
            templateUrl: 'views/tmpl/custom_group/create_groups/custom-group-view.html',
            resolve: {
                plugins: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'scripts/vendor/datatables/datatables.bootstrap.min.css',
                        'scripts/vendor/datatables/Pagination/input.js',
                        'scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js'
                    ]);
                }]
            }
        })

        //create groups/custom-group-add-drivers
        .state('app.custom-groups.create-groups-drivers', {
            url: '/create_groups_drivers/:group_id',
            controller: 'CustomGroupDriversCtrl',
            templateUrl: 'views/tmpl/custom_group/create_groups/custom-group-add-drivers.html',
            resolve: {
                plugins: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'scripts/vendor/datatables/datatables.bootstrap.min.css',
                        'scripts/vendor/datatables/Pagination/input.js',
                        'scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js'
                    ]);
                }]
            }
        })

        // create groups/custom-group-single-driver
        .state('app.custom-groups.single-driver', {
            url: '/single-driver/:group_id/:driver_id',
            controller: 'CustomGroupsSingleDriverCtrl',
            templateUrl: 'views/tmpl/custom_group/create_groups/custom-group-single-driver.html',
            resolve: {
                plugins: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'scripts/vendor/datatables/datatables.bootstrap.min.css',
                        'scripts/vendor/datatables/Pagination/input.js',
                        'scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js'
                    ]);
                }]
            }
        })

        .state('app.notifications', {
                url: '/notifications',
                template: '<div ui-view></div>'
            })


        //notifications/view
        .state('app.notifications.notifications-all', {
            url: '/all_notifications',
            controller: 'AllNotificationsCtrl',
            templateUrl: 'views/tmpl/notifications/all_notifications.html'

        })

         //create groups/custom-group-info
        // .state('app.custom-groups.groups-info-single-drivers', {
        //     url: '/groups_info_single_drivers/:group_id/:driver_id',
        //     controller: 'CustomGroupSingleDriverInfoCtrl',
        //     templateUrl: 'views/tmpl/custom_group/group_information/custom-group-single-driver-info.html',
        //     resolve: {
        //         plugins: ['$ocLazyLoad', function($ocLazyLoad) {
        //             return $ocLazyLoad.load([
        //                 'scripts/vendor/datatables/datatables.bootstrap.min.css',
        //                 'scripts/vendor/datatables/Pagination/input.js',
        //                 'scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js'
        //             ]);
        //         }]
        //     }
        // })



        //         .state('app.groups.create_groups', {
        //             url: '/my_account',
        //             controller: 'MyAccountCtrl',
        //             templateUrl: 'views/tmpl/profile/my_account.html'
        //         })
        .state('app.profile', {
                url: '/profile',
                template: '<div ui-view></div>'
            })
            .state('app.profile.my_account', {
                url: '/my_account',
                controller: 'MyAccountCtrl',
                templateUrl: 'views/tmpl/profile/my_account.html'
            })
            .state('app.profile.reset_password', {
                url: '/reset_password',
                controller: 'ResetPasswordCtrl',
                templateUrl: 'views/tmpl/profile/reset_password.html'
            })
            .state('app.free_ads', {
                url: '/free_ads',
                template: '<div ui-view></div>'
            })
            .state('app.free_ads.file_upload', {
                url: '/file_upload',
                controller: 'FileUploadCtrl',
                templateUrl: 'views/super_admin/Ads_uploads.html'
            })
            // forms/upload
            .state('app.forms.upload', {
                url: '/upload',
                controller: 'FormUploadCtrl',
                templateUrl: 'views/tmpl/forms/upload.html',
                resolve: {
                    plugins: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'scripts/vendor/filestyle/bootstrap-filestyle.min.js'
                        ]);
                    }]
                }
            })
            //forms/imgcrop
            .state('app.forms.imgcrop', {
                url: '/imagecrop',
                controller: 'FormImgCropCtrl',
                templateUrl: 'views/tmpl/forms/imgcrop.html',
                resolve: {
                    plugins: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'scripts/vendor/filestyle/bootstrap-filestyle.min.js'
                        ]);
                    }]
                }
            })
            //tables
            .state('app.tables', {
                url: '/tables',
                template: '<div ui-view></div>'
            })
            //tables/bootstrap
            .state('app.tables.bootstrap', {
                url: '/bootstrap',
                controller: 'TablesBootstrapCtrl',
                templateUrl: 'views/tmpl/tables/bootstrap.html'
            })
            //tables/datatables
            .state('app.tables.datatables', {
                url: '/datatables',
                controller: 'TablesDatatablesCtrl',
                templateUrl: 'views/tmpl/tables/datatables.html',
                resolve: {
                    plugins: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'scripts/vendor/datatables/ColReorder/css/dataTables.colReorder.min.css',
                            'scripts/vendor/datatables/ColReorder/js/dataTables.colReorder.min.js',
                            'scripts/vendor/datatables/Responsive/dataTables.responsive.css',
                            'scripts/vendor/datatables/Responsive/dataTables.responsive.js',
                            'scripts/vendor/datatables/ColVis/css/dataTables.colVis.min.css',
                            'scripts/vendor/datatables/ColVis/js/dataTables.colVis.min.js',
                            'scripts/vendor/datatables/TableTools/css/dataTables.tableTools.css',
                            'scripts/vendor/datatables/TableTools/js/dataTables.tableTools.js',
                            'scripts/vendor/datatables/datatables.bootstrap.min.css'
                        ]);
                    }]
                }
            })
            //tables/uiGrid
            .state('app.tables.ui-grid', {
                url: '/ui-grid',
                controller: 'TablesUiGridCtrl',
                templateUrl: 'views/tmpl/tables/ui-grid.html'
            })
            //tables/ngTable
            .state('app.tables.ng-table', {
                url: '/ng-table',
                controller: 'TablesNgTableCtrl',
                templateUrl: 'views/tmpl/tables/ng-table.html'
            })
            //tables/smartTable
            .state('app.tables.smart-table', {
                url: '/smart-table',
                controller: 'TablesSmartTableCtrl',
                templateUrl: 'views/tmpl/tables/smart-table.html'
            })
            //tables/fooTable
            .state('app.tables.footable', {
                url: '/footable',
                controller: 'TablesFootableCtrl',
                templateUrl: 'views/tmpl/tables/footable.html',
                resolve: {
                    plugins: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'scripts/vendor/footable/dist/footable.all.min.js',
                            'scripts/vendor/footable/css/footable.core.min.css'
                        ]);
                    }]
                }
            })
            //charts
            .state('app.charts', {
                url: '/charts',
                controller: 'ChartsCtrl',
                templateUrl: 'views/tmpl/charts.html',
                resolve: {
                    plugins: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'scripts/vendor/flot/jquery.flot.resize.js',
                            'scripts/vendor/flot/jquery.flot.orderBars.js',
                            'scripts/vendor/flot/jquery.flot.stack.js',
                            'scripts/vendor/flot/jquery.flot.pie.js',
                            'scripts/vendor/gaugejs/gauge.min.js'
                        ]);
                    }]
                }
            })
            //layouts
            .state('app.layouts', {
                url: '/layouts',
                template: '<div ui-view></div>'
            })
            //layouts/boxed
            .state('app.layouts.boxed', {
                url: '/boxed',
                controller: 'BoxedlayoutCtrl',
                templateUrl: 'views/tmpl/layouts/boxed.html',
                containerClass: 'boxed-layout'
            })
            //layouts/fullwidth
            .state('app.layouts.fullwidth', {
                url: '/fullwidth',
                controller: 'FullwidthlayoutCtrl',
                templateUrl: 'views/tmpl/layouts/fullwidth.html'
            })
            //layouts/sidebar-sm
            .state('app.layouts.sidebar-sm', {
                url: '/sidebar-sm',
                controller: 'SidebarsmlayoutCtrl',
                templateUrl: 'views/tmpl/layouts/sidebar-sm.html',
                containerClass: 'sidebar-sm-forced sidebar-sm'
            })
            //layouts/sidebar-xs
            .state('app.layouts.sidebar-xs', {
                url: '/sidebar-xs',
                controller: 'SidebarxslayoutCtrl',
                templateUrl: 'views/tmpl/layouts/sidebar-xs.html',
                containerClass: 'sidebar-xs-forced sidebar-xs'
            })
            //layouts/offcanvas
            .state('app.layouts.offcanvas', {
                url: '/offcanvas',
                controller: 'OffcanvaslayoutCtrl',
                templateUrl: 'views/tmpl/layouts/offcanvas.html',
                containerClass: 'sidebar-offcanvas'
            })
            //layouts/hz-menu
            .state('app.layouts.hz-menu', {
                url: '/hz-menu',
                controller: 'HzmenuCtrl',
                templateUrl: 'views/tmpl/layouts/hz-menu.html',
                containerClass: 'hz-menu'
            })
            //layouts/rtl-layout
            .state('app.layouts.rtl', {
                url: '/rtl',
                controller: 'RtlCtrl',
                templateUrl: 'views/tmpl/layouts/rtl.html',
                containerClass: 'rtl'
            })
            //maps
            .state('app.maps', {
                url: '/maps',
                template: '<div ui-view></div>'
            })
            //maps/vector
            .state('app.maps.vector', {
                url: '/vector',
                controller: 'VectorMapCtrl',
                templateUrl: 'views/tmpl/maps/vector.html',
                resolve: {
                    plugins: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'scripts/vendor/jqvmap/jqvmap/jquery.vmap.min.js',
                            'scripts/vendor/jqvmap/jqvmap/maps/jquery.vmap.world.js',
                            'scripts/vendor/jqvmap/jqvmap/maps/jquery.vmap.usa.js',
                            'scripts/vendor/jqvmap/jqvmap/maps/jquery.vmap.europe.js',
                            'scripts/vendor/jqvmap/jqvmap/maps/jquery.vmap.germany.js'
                        ]);
                    }]
                }
            })
            //maps/google
            .state('app.maps.google', {
                url: '/google',
                controller: 'GoogleMapCtrl',
                templateUrl: 'views/tmpl/maps/google.html'
            })
            //maps/leaflet
            .state('app.maps.leaflet', {
                url: '/leaflet',
                controller: 'LeafletMapCtrl',
                templateUrl: 'views/tmpl/maps/leaflet.html'
            })
            //calendar
            .state('app.calendar', {
                url: '/calendar',
                controller: 'CalendarCtrl',
                templateUrl: 'views/tmpl/calendar.html'
            })
            //app core pages (errors, login,signup)
            .state('core', {
                abstract: true,
                url: '/core',
                template: '<div ui-view></div>'
            })
            //login
            .state('core.login', {
                url: '/login',
                controller: 'LoginCtrl',
                templateUrl: 'views/tmpl/login/login.html'
            })
            //driver verification by super admin
            .state('app.driver', {
                url: '/driver',
                template: '<div ui-view></div>'
            })
            //shop/orders
            .state('app.driver.drivers', {
                url: '/drivers',
                controller: 'DriversCtrl',
                templateUrl: 'views/super_admin/drivers.html',
                resolve: {
                    plugins: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'scripts/vendor/datatables/datatables.bootstrap.min.css',
                            'scripts/vendor/datatables/Pagination/input.js',
                            'scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js'
                        ]);
                    }]
                }
            })
            //shop/single-driver
            .state('app.driver.single-driver', {
                url: '/single-driver/:driver_id',
                controller: 'SingleDriverCtrl',
                templateUrl: 'views/super_admin/single-driver.html',
                resolve: {
                    plugins: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'scripts/vendor/datatables/datatables.bootstrap.min.css',
                            'scripts/vendor/datatables/Pagination/input.js',
                            'scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js'
                        ]);
                    }]
                }
            })
            // //dashboard
            // .state('app.driver_verification', {
            //     url: '/driver_verification',
            //     controller: 'DriverVerificationCtrl',
            //     templateUrl: 'views/super_admin/driver_verification.html',
            //     resolve: {
            //         plugins: ['$ocLazyLoad', function($ocLazyLoad) {
            //             return $ocLazyLoad.load([
            //                 'scripts/vendor/datatables/datatables.bootstrap.min.css',
            //                 'scripts/vendor/datatables/Pagination/input.js',
            //                 'scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js'
            //             ]);
            //         }]
            //     }
            // })


        //signup
        .state('core.signup', {
                url: '/signup',
                controller: 'SignupCtrl',
                templateUrl: 'views/tmpl/signup/signup.html'
            })
            //forgot password
            .state('core.forgotpass', {
                url: '/forgot-password',
                controller: 'forgotPwdCtrl',
                templateUrl: 'views/tmpl/profile/forgotpass.html'
            })
            //reset password from email
            .state('core.resetpass', {
                url: '/reset_password',
                controller: 'ResetPassEmailCtrl',
                templateUrl: 'views/tmpl/profile/reset_password_email.html'
            })
            //logout
            .state('core.logout', {
                url: '/login',
                controller: 'LogoutCtrl',
                templateUrl: 'views/tmpl/login/login.html'

            })
            //page 404
            .state('core.page404', {
                url: '/page404',
                templateUrl: 'views/tmpl/pages/page404.html'
            })
            //page 500
            .state('core.page500', {
                url: '/page500',
                templateUrl: 'views/tmpl/pages/page500.html'
            })
            //page offline
            .state('core.page-offline', {
                url: '/page-offline',
                templateUrl: 'views/tmpl/pages/page-offline.html'
            })
            //locked screen
            .state('core.locked', {
                url: '/locked',
                templateUrl: 'views/tmpl/pages/locked.html'
            })
            //example pages
            .state('app.pages', {
                url: '/pages',
                template: '<div ui-view></div>'
            })
            //gallery page
            .state('app.pages.gallery', {
                url: '/gallery',
                controller: 'GalleryCtrl',
                templateUrl: 'views/tmpl/pages/gallery.html',
                resolve: {
                    plugins: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'scripts/vendor/mixitup/jquery.mixitup.js'
                        ]);
                    }]
                }
            })
            //timeline page
            .state('app.pages.timeline', {
                url: '/timeline',
                controller: 'TimelineCtrl',
                templateUrl: 'views/tmpl/pages/timeline.html'
            })
            //chat page
            .state('app.pages.chat', {
                url: '/chat',
                controller: 'ChatCtrl',
                templateUrl: 'views/tmpl/pages/chat.html'
            })
            //search results
            .state('app.pages.search-results', {
                url: '/search-results',
                controller: 'SearchResultsCtrl',
                templateUrl: 'views/tmpl/pages/search-results.html',
                resolve: {
                    plugins: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'scripts/vendor/slider/bootstrap-slider.js'
                        ]);
                    }]
                }
            })
            //profile page
            .state('app.pages.profile', {
                url: '/profile',
                controller: 'ProfileCtrl',
                templateUrl: 'views/tmpl/pages/profile.html',
                resolve: {
                    plugins: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'scripts/vendor/filestyle/bootstrap-filestyle.min.js'
                        ]);
                    }]
                }
            })
            //intro page
            .state('app.pages.intro', {
                url: '/intro',
                controller: 'IntroPageCtrl',
                templateUrl: 'views/tmpl/pages/intro.html'
            })
            //documentation
            .state('app.help', {
                url: '/help',
                controller: 'HelpCtrl',
                templateUrl: 'views/tmpl/help.html'
            });
    }]);
