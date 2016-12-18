'use strict';

app.factory("notification", ['toastr', 'toastrConfig', funcnotification]);

function funcnotification(toastr, toastrConfig) {
   
    var openedToasts = [];

    var toast = {
        colors: [
            { name: 'primary' },
            { name: 'success' },
            { name: 'warning' },
            { name: 'error' },
            { name: 'info' },
            { name: 'default' },
            { name: 'cyan' },
            { name: 'amethyst' },
            { name: 'green' },
            { name: 'orange' },
            { name: 'red' },
            { name: 'greensea' },
            { name: 'dutch' },
            { name: 'hotpink' },
            { name: 'drank' },
            { name: 'blue' },
            { name: 'lightred' },
            { name: 'slategray' },
            { name: 'darkgray' }
        ],
        msg: 'Gnome & Growl type non-blocking notifications',
        title: 'This is toaster notification'
    };

    var options = {
        position: 'toast-top-right',
        type: 'success',
        iconClass: toast.colors[1],
        timeout: '5000',
        extendedTimeout: '1000',
        html: false,
        closeButton: true,
        tapToDismiss: true,
        closeHtml: '<i class="fa fa-times"></i>'
    };

    subscribeToChannel();
    function subscribeToChannel() {
        var Logger = {
            incoming: function(message, callback) {
                console.log('incoming', message);
                callback(message);
            },
            outgoing: function(message, callback) {
                message.ext = message.ext || {};
                // message.ext.auth_token = $window.sessionStorage['Auth-Token'];
                // message.ext.auth_token = "8e70d74ca671fc2afa7c7bd0aaf3a39e";
                message.ext.user_type = "user";
                console.log('outgoing', message);
                callback(message);
            }
        }

        var FayeServerURL = appSettings.FayeServerUrl
        var client = new Faye.Client(FayeServerURL);
        client.addExtension(Logger);
         funcnotification();
        var subscription = client.subscribe('/publish/company_145', function(message) {
            //alert(message.data))
            console.log("message", message.data)
                //funcnotification();
                //$("#container").append("<p>"+ message.data+"</p>")
        });
        subscription.then(function() {
            //alert('Subscription is now active!');
        });
    }

    //     $scope.$watchCollection('options', function(newValue) {
    //         toastrConfig.allowHtml = newValue.html;
    //         toastrConfig.extendedTimeOut = parseInt(newValue.extendedTimeout, 10);
    //         toastrConfig.positionClass = newValue.position;
    //         toastrConfig.timeOut = parseInt(newValue.timeout, 10);
    //         toastrConfig.closeButton = newValue.closeButton;
    //         toastrConfig.tapToDismiss = newValue.tapToDismiss;
    //         toastrConfig.closeHtml = newValue.closeHtml;
    //     });

    // $scope.clearLastToast = function() {
    //     var toast = openedToasts.pop();
    //     toastr.clear(toast);
    // };

    // $scope.clearToasts = function() {
    //     toastr.clear();
    // };

    return {
        opentoast: function(msg, title) {
            var toast = toastr[options.type](msg, title, {
                iconClass: 'toast-' + options.iconClass.name + ' ' + 'bg-' + options.iconClass.name
            });

            openedToasts.push(toast);

        },
        closetoast: function() {

        }
    }
}
