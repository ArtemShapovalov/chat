define(['app'], function (app) {

    'use strict';

    app.directive('sendMessage', ['chatService', '$timeout', function(chatService, $timeout){
        return {
            restrict: 'A',
            template: '<button>Send Message</button>',
            transclude: true,
            replace: true,
            scope: {
                messageText: '='
            },
            link: function(scope, element, attrs){
                element.bind("click", function (event) {
                    chatService.sendMessage(function(){
                    })
                });
            }
        }
    }]);

    app.directive('messageText', ['chatService', '$timeout', function(chatService, $timeout) {
        return {
            restrict: 'A',
            template: '<input/>',
            replace: true,
            scope: true,
            //transclue: true,
            link: function(scope, element, attrs){
                element.bind("keydown keypress", function (event) {
                    if(event.which === 13) {
                        chatService.sendMessage(function(){
                        });
                        event.preventDefault();
                    }

                    clearTimeout(element.data('timer'));
                    var wait = setTimeout(function(){
                        chatService.sendTyping();
                    }, 500);
                    element.data('timer', wait);
                });
            }

        }
    }]);
});
