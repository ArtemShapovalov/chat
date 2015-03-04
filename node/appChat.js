var PORT = 8080;

var options = {
//    'log level': 0
};

var request = require('request');
var http = require('http');
var express = require('express');
var _ = require('lodash');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server, options);
server.listen(PORT);



// usernames which are currently connected to the chat
var usernames = {};

io.sockets.on('connection', function (client) {

    // when the client emits 'adduser', this listens and executes
    client.on('adduser', function(data){
        var time = (new Date);
        // store the username in the socket session for this client
        client.username = data.username;
        // store the room name in the socket session for this client
        client.room = data.room;
        // send client to room 1
        client.join(data.room);
        // add the client's username to the global list
        if (!usernames[data.room]) {
            usernames[data.room] = {};
        }
        usernames[data.room][data.username] = data.username;

        //client.broadcast.to(data.room).emit("update-members", usernames[data.room]);
        io.sockets.in(data.room).emit("update-members", usernames[data.room]);

        // echo to room 1 that a person has connected to their room
        client.broadcast.to(data.room).emit('update', 'SERVER', data.username + ' has connected to this room', time);
        client.emit('message', data.room);
    });


    client.on('message', function (message, callback) {
        try {
            var time = (new Date);
            message = _.extend({},message, {'time': time});
            client.broadcast.to(client.room).emit('message', message);
            callback({success:true, time:time})

        } catch (e) {
            console.log(e);
            client.disconnect();
        }
    });

    client.on('typing', function () {
        client.broadcast.to(client.room).emit('typing', {name: client.username});
    });

    client.on('disconnect', function() {
        var time = (new Date).toLocaleTimeString();
        // remove the username from global usernames list
        delete usernames[client.room][client.username];
        // update list of users in chat, client-side
        io.sockets.in(client.room).emit("update-members", usernames[client.room]);
        // echo globally that this client has left
        client.broadcast.emit('update', 'SERVER', client.username + ' has disconnected');
        client.leave(client.room);
    });
});
