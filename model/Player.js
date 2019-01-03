/*
    model/Player 

    Handles an individual player's information 
*/

class Player {
    // constructor for a brand new user 
    constructor(username, pot) {
        this.username = username;
        this.pot = pot; 
        this.bet = 0;  
        this.playing = false; 
    }
}

module.exports = Player; 