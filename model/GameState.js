/*
    game_state/GameState

    Manages the status of the current game.
    Keeps track of players and table information
*/

class GameState {
    constructor() {
        this.currPlayer = null;
        this.players = [];
        this.tableCards = [];
        this.bet = 0;
        this.pot = 0;
        this.step = 0; 
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
}

module.exports = GameState; 