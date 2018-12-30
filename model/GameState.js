/*
    game_state/GameState

    Manages the status of the current game.
    Keeps track of players and table information
*/

class GameState {
    constructor() {
        this.dealer = null; 
        this.currPlayer = null;
        this.players = [];
        this.tableCards = [];
        this.bet = -1;
        this.pot = -1;
        this.step = -1; 
        this.sockets = {};
    }

    getPlayers() {
        // get all players in the game 
        return this.players;
    }

    addPlayer(player) {
        // adds a new player to the room
        // check if this player is already in the room before pushing.. 
        this.players.push(player);
    }

    removePlayer(player) {
        // removes given player from room
        // error if player is not in the room 
        let players = this.players;
        for (var i = 0; i < players.length; i++) {
            if (player.username.toLowerCase() == players[i].username.toLowerCase()) {
                players.splice(i, 1);
            }
        }
        this.players = players; 
    }

    getBet() {
        // gets the tables bet
        return this.bet;
    }

    setBet(bet) {
        // sets the tables bet 
        if (bet > this.bet) {
            console.log('Bet set to ' + bet);
            this.bet = bet;
        }
        else if (bet == 0) {
            console.log('Bet has been reset')
        }
        else {
            console.log('Error: New bet must exceed current bet');
            return false; 
        }
        return true; 
    }

    getPot() {
        // gets the tables pot
        return this.pot;
    }

    setPot(pot) {
        // sets the tables pot
        this.pot = pot; 
    }

    toggleReady(username) {
        // inverts the given user's playing status
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].username === username) {
                this.players[i].playing = !this.players[i].playing;
                return this.players[i]; 
            }
        }
        return null; 
    }

    setReady(username) {
        // sets the given user to playing
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].username === username) {
                this.players[i].playing = true;
                return this.players[i]; 
            }
        }
        return null; 
    }

    unsetReady(username) {
        // set the given user to not ready
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].username === username) {
                this.players[i].playing = false;
                return this.players[i]; 
            }
        }
        return null; 
    }

    checkReady() {
        // determines if enough players are readied up to play
        if (this.players.length < 2) {
            // need at least 2 players to play
            return false; 
        }
        for (var i = 0; i < this.players.length; i++) {
            // if a single user is not ready, return false 
            if (!this.players[i].playing) return false; 
        }
        return true; 
    }
}

module.exports = GameState; 