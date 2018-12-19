const express = require('express');
const router = express.Router();

// TODO add socket to this routing schema

// POST::login
// attempt to login the user 
router.post('/login', (req, res) => {
    req.app.io.emit('welcome', {text: 'sockets on'});
    res.json({ cool: 'true' });
});

// POST::register
router.post('/register', (req, res) => {
    console.log(req.body.username)
    res.json({ err: 'this is an error' });
});

module.exports = router;