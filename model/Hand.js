/*
    model/Hand 

    A user will have a hand of 2 cards. 
    This is seperated from the player model for encapsulation purposes
*/

class Hand {
    // username will be the unique id bound to each hand
    constructor(username) {
        this.username = username;
        this.c1 = -1;
        this.c2 = -1;
    }
    // card values are integers >= 0. -1 denotes no card 
}

module.exports = Hand; 