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
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const server = app.listen(4000);
const io = require('socket.io')(server, {origins: 'http://localhost:3000'});

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());

app.io = io;

const accounts = require('./routes/api/accounts');
app.use('/api/accounts', accounts);

const Game = require('./model/GameState');
const Player = require('./model/Player');

let game = new Game;  

// socket-io connections handled here
io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id);
    socket.emit('welcome', {text: 'Connected to server'});
    let player = new Player; 
    game.addPlayer(player);
    // emit the updated list of players
    console.log('who: ' + game.getPlayers());
    socket.emit('who', {players: game.getPlayers()});

    // handle user disconnections 
    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
    });
});

// set port and launch server
const port = 4000;
server.listen(port, () => console.log('Server started on port ' + port));