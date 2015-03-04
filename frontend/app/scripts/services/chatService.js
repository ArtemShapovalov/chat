/* global define */

define(['app', 'directives/messagesDirective'], function (app) {

	'use strict';

	app.factory('chatService', ['$rootScope', '$http', function ($rootScope, $http) {

		/**
		 * Essentially the data (model) will be retrieved from server
		 * via ajax request using the $http service. In this example,
		 * we have hard-coded the model here for simplicity's sake.
		 */
        var self = this;
        var socket;
        var messageText = '';
        var socketDomain = 'http://localhost:8080';
        var apiDomain = 'http://localhost:8092';

        self.messages = [];
        self.members = [];
        self.waitTyping = null;
        self.room = 'main';

		return {
            socket: socket,
            members: self.members,
            name: self.name,
            room: self.room,
            messageText: messageText,
            messages: self.messages,
            connect: function() {
                var self = this;
                socket = io.connect(socketDomain);
                /**
                 * Event connect user to chat
                 */
                socket.on('connect', function () {
                    //self.messages.push({text: 'Соединение установленно!'});
                    socket.emit('adduser', {username: self.name, room: self.room});
                    $rootScope.$apply();
                });
                /**
                 * Event generated after send message
                 */
                socket.on('message', function (data) {
                    self.messages.push({owner: data.name, text: data.message, time: data.time});
                    $rootScope.$apply();
                });
                /**
                 * Event about system change
                 */
                socket.on('update', function (info, message) {
                    self.messages.push({owner: info, text: message, time: ''});
                    $rootScope.$apply();
                });
                /**
                 * Event generated after change in members chat
                 */
                socket.on('update-members', function(data) {
                    self.members = data;
                    $rootScope.$apply();
                });

                socket.on('typing', function(data) {
                    var member = data.name;
                    self.members[member] = member + ' typing...';

                    clearTimeout(self.waitTyping);
                    self.waitTyping = setTimeout(function(){
                        self.members[member] = member;
                        $rootScope.$apply();
                    }, 3000);

                    $rootScope.$apply();
                });
            },
            dateFormat: function(now) {
                if (!now) return;
                var date = new Date(Date.parse(now))/*,
                    h = date.getHours(),
                    m = "0" + date.getMinutes(),
                    s = "0" + date.getSeconds(),
                    formattedTime = h + ':' + m.substr(m.length-2) + ':' + s.substr(s.length-2)*/;
                return date.toLocaleTimeString();
            },
            sendTyping: function() {
                socket.emit('typing');
            },
            sendMessage: function (callback) {
                var self = this;
                if (self.messageText.length <= 0)
                    return;

                socket.emit("message", {message: self.messageText, name: self.name}, function(data) {
                    $http.post(apiDomain + '/v1/messages', {room: self.room, owner: self.name, text: self.messageText, created_at: (new Date(data.time)).getTime()})
                        .success(function(response, status, headers, config) {
                            self.appendToMessages({owner: self.name, text: self.messageText, time: data.time});
                            self.messageText = '';
                            if (callback) {
                                callback();
                            }
                        })
                        .error(function(data, status, headers, config) {
                            console.log(data);
                        });
                });
            },
            appendToMessages: function(data) {
                var self = this;
                self.messages.push(data);
            },
            downloadHistory: function() {
                var self = this;
                $http.get(apiDomain + '/v1/messages?room='+self.room)
                    .success(function(data, status, headers, config) {
                        for (var n in data) {
                            var dtime = new Date(data[n].created_at);
                            self.appendToMessages({owner: data[n].owner, text: data[n].text, time: dtime});
                        }
                    })
                    .error(function(data, status, headers, config) {
                        console.log(data);
                    });
            }
		};

	}]);
});