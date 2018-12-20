/*
    Game controller

    Handle the game state from within here 
*/

const express = require('express');
const router = express.Router();

// POST new-player
// adds a new player to the game 
router.post('/joinGame', (req, res) => {
    // this is evaluating to undefined? 
    console.log(res.body);
});

module.exports = router;