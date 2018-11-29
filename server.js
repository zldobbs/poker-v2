/*
    Poker v2
    11/28/18 
    Zachary Dobbs

    Online poker application developed with the MERN stack.
    This is the second attempt at making an online poker game.
    The first attempt utilized Vue, see here: https://github.com/zldobbs/Poker
*/

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Socket-io connections handled here
io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id);

    // Handle user disconnections 
    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
    });
});

// Set port and launch server
const port = 4000;
server.listen(port, () => console.log('Server started on port ' + port));