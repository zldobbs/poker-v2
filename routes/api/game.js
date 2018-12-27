/*
    Game controller

    Handle the game state from within here 
*/

const express = require('express');
const router = express.Router();

// POST::ready
// set the given user's state to ready 
router.post('/ready', (req, res) => {
    res.json(req.body.username);
});

module.exports = router;