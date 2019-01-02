/*
    model/Hand 

    A user will have a hand of 2 cards. 
    This is seperated from the player model for encapsulation purposes
*/

const Deck = require('./Deck');

class Hand {
    // username will be the unique id bound to each hand
    constructor(username) {
        this.username = username;
        this.c1 = Deck.draw();
        this.c2 = Deck.draw();
    }
    // card values are integers >= 0. -1 denotes no card 
}

module.exports = Hand; 