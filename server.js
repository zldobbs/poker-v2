/*
    Poker v2
    11/28/18 
    Zachary Dobbs

    Online poker application developed with the MERN stack.
    This is the second attempt at making an online poker game.
    The first attempt utilized Vue, see here: https://github.com/zldobbs/Poker

    Entry point for backend here. Handle routing and communications from the client. 
*/

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const server = app.listen(4000);
const io = require('socket.io')(server, {origins: 'http://localhost:3000'});

// Socket-io connections handled here
io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id);
    socket.emit('welcome', {text: 'Connected to server'});
    // Handle user disconnections 
    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
    });
});

// Set port and launch server
const port = 4000;
server.listen(port, () => console.log('Server started on port ' + port));