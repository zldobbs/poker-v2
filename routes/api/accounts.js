/*
    Accounts controller 

    Handle account manipulations here 

    TODO::
    prevent users from logging in with an account that is already logged in 
    test if updating the users pot on logout is working
    implement logout functionality on disconnects
*/

const express = require('express');
const router = express.Router();
const fs = require('fs');

const Player = require('../../model/Player');

// takes in a json array of user profiles to be written to the json file 
function updateAccountFile(accounts) {
    let accountsJSON = JSON.stringify(accounts);
    fs.writeFile("./model/store.json", accountsJSON, 'utf8', (err) => {
        if (err) {
            console.log(err);
            return false; 
        }
    });
    return true;
}

// POST::login
// attempt to login the user 
router.post('/login', (req, res) => {
    let accounts = require('../../model/store.json');
    let data; 
    for (var i = 0; i < accounts.length; i++) {
        if (accounts[i].username.toLowerCase() == req.body.username.toLowerCase()) {
            if (accounts[i].password == req.body.password) {
                // sign in successful 
                var player = new Player( accounts[i].username, accounts[i].pot );
                data = { succ: true, user: player };
                req.app.game.addPlayer(player);
                req.app.io.emit('who', {players: req.app.game.getPlayers()});
                res.json(data);
            }
            else {
                data = { succ: false, err: true, errText: 'Incorrect password' };
                res.json(data);
            }
        }
        if (data) break;
    }
    if (!data) {
        data = { succ: false, err: true, errText: 'Username does not exist' };
        res.json(data);
    }
});

// POST::register
// attempt to register the user 
router.post('/register', (req, res) => {
    let accounts = require('../../model/store.json');
    let data;
    for (var i = 0; i < accounts.length; i++) {
        if (accounts[i].username.toLowerCase() == req.body.username.toLowerCase()) {
            // username already exists 
            data = { succ: false, err: true, errText: 'Username already exists' };
            res.json(data);
        }
        if (data) break;
    }
    if (!data) {
        // user not found
        let user = {
            username: req.body.username,
            password: req.body.password,
            pot: 1000
        }
        // let player = new Player(user.username, user.pot);
        accounts.push(user);
        if (updateAccountFile(accounts)) {
            var userNoPass = { username: user.username, pot: user.pot };
            var player = new Player( user.username, user.pot );
            req.app.game.addPlayer(player);
            req.app.io.emit('who', {players: req.app.game.getPlayers()});
            data = { succ: true, user: userNoPass };
            res.json(data);
        }
    }
});

// POST::logout
// logs out the user 
router.post('/logout', (req, res) => {
    // need to update the user's pot 
    // send updated player list to all users
    let data; 
    let accounts = require('../../model/store.json');
    for (var i = 0; i < accounts.length; i++) {
        if (accounts[i].username.toLowerCase() == req.body.username.toLowerCase()) {
            accounts[i].pot = req.body.pot; 
            updateAccountFile(accounts);
            req.app.game.removePlayer(accounts[i]);
            req.app.io.emit('who', {players: req.app.game.getPlayers()});
            data = { succ: true };
            res.json(data);
        }
        if (data) break; 
    }
    if (!data) {
        data = { succ: false, err: true, errText: 'Unable to find player' };
        res.json(data);
    }
});

module.exports = router;