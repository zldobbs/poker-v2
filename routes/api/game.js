/*
    Game controller

    Handle the game state from within here 
*/

const express = require('express');
const router = express.Router();

// POST::ready
// set the given user's state to ready 
router.post('/ready', (req, res) => {
    let data;
    if (req.app.game.step == -1) {
        let user = req.app.game.toggleReady(req.body.username);
        if (!user) {
            data = { succ: false, err: true, errText: "Unable to find player in game" };
        }
        else {
            data = { succ: true, user: user };
        }
        // should also send an updated list of users 
        if (data.succ) {
            req.app.io.emit('who', { players: req.app.game.getPlayers() });
        }
        // need to check if enough players are ready to start playing 
        if (req.app.game.checkReady()) {
            // should start the game if enough players are ready 
            console.log('Game is ready to start');
        }
    }
    else {
        data = { succ: false, err: true, errText: "Game already in progress" };
    }
    res.json(data);
});

module.exports = router;