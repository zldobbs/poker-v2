/*
    Accounts controller 

    Handle account manipulations here 
*/

const express = require('express');
const router = express.Router();
const fs = require('fs');

const Player = require('../../model/Player');

// POST::login
// attempt to login the user 
router.post('/login', (req, res) => {
    // using io in the api: 
    // req.app.io.emit('welcome', {text: 'sockets on'});
    // response ex: res.json({ cool: 'true' });
    let accounts = require('../../model/store.json');
    
});

// POST::register
router.post('/register', (req, res) => {
    let accounts = require('../../model/store.json');
    let data;
    for (var i = 0; i < accounts.length; i++) {
        if (accounts[i].username.toLowerCase() == req.body.username.toLowerCase()) {
            // username already exists 
            data = { succ: false, err: true, errText: 'Username already exists' };
            res.json(data);
        }
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
        let accountsJSON = JSON.stringify(accounts);
        fs.writeFile("./model/store.json", accountsJSON, 'utf8', (err) => {
            if (err) {
                console.log(err);
            }
            else {
                var userNoPass = { username: user.username, pot: user.pot };
                data = { succ: true, user: userNoPass };
                res.json(data);
            }
        });
    }
});

module.exports = router;