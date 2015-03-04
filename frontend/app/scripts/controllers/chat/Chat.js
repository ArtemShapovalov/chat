/* global define */

define(['app'], function (app) {

	'use strict';

    function chatController($scope, $location, chatService) {
        if (!chatService.name) {
            $location.path('/');
        }
        $scope.chat = chatService;
    }

	app.register.controller('ChatController', ['$scope', '$location', 'chatService', chatController]);
});