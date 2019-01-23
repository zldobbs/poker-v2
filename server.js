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
const game = require('./routes/api/game');
app.use('/api/accounts', accounts);
app.use('/api/game', game);

const Game = require('./model/GameState');
const Player = require('./model/Player');

let gameState = new Game;  
app.game = gameState; 

// update every user on the current game state
app.updateGameState = function updateGameState() {
    let game = app.game; 
    let gamestate = {
        winners: game.winners, 
        dealer: game.dealer,
        currPlayer: game.currPlayer,
        tableCards: game.tableCards,
        bet: game.bet,
        pot: game.pot,
        step: game.step
    }
    io.emit('game state', { game: gamestate });
}

// socket-io connections handled here
io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id);
    console.log(app.game.getPlayers());

    socket.emit('who', { players: app.game.getPlayers() });
    app.updateGameState();

    // retrieve username from client to bind to the socket 
    socket.on('bind user', (user) => {
        app.game.sockets[user.username] = socket; 
    });

    // handle user disconnections 
    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
        // find user in game state's socket array to force a logout
        for (var username in app.game.sockets) {
            if (app.game.sockets[username] === socket) {
                console.log(username + ' logged out');
                app.game.removePlayer({username: username});
                delete app.game.sockets[username];
                app.updateGameState();
                io.emit('who', { players: app.game.getPlayers() });
            }
        }
    });
});

// set port and launch server
const port = 4000;
server.listen(port, () => console.log('Server started on port ' + port));