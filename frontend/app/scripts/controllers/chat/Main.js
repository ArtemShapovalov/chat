/* global define */

define(['app'], function (app) {

	'use strict';

    function mainController($scope, $location, chatService) {
        $scope.room = chatService.room;
        $scope.go = function ( path ) {
            chatService.name = $scope.name;
            chatService.room = $scope.room;
            chatService.connect();
            chatService.downloadHistory();
            $location.path( path );
        };
    };

	app.register.controller('MainController', ['$scope', '$location', 'chatService', mainController]);
});