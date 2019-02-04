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
            // move to the pre flop stage
            if (req.app.game.preFlop()) {
                req.app.updateGameState();
            } 
            else {
                data = { succ: false, err: true, errText: "Pre-flop failure" };
            }
        }
    }
    else {
        data = { succ: false, err: true, errText: "Game already in progress" };
    }
    res.json(data);
});

// POST::play
// handle the user's action and update game accordingly 
router.post('/action', (req, res) => {
    let data; 
    switch(req.body.action) {
        case 0: 
            console.log(req.body.user.username + ' folds');
            req.app.game.handleFold(req.body.user);
            break;
        case 1:
            console.log(req.body.user.username + ' checks');
            req.app.game.handleCheck(req.body.user);
            break;
        case 2:
            console.log(req.body.user.username + ' bets');
            req.app.game.handleBet(req.body.user);
            break;
        default:
            data = { succ: false, err: true, errText: "Unknown user attempted action" };
            break;
    }
    if (!data) {
        console.log('should update');
        req.app.game.updateTableState();
        console.log('winner: ' + req.app.game.winners);
        req.app.updateGameState();
    }
    res.json(data);
});

module.exports = router;