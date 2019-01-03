/*
    game_state/GameState

    Manages the status of the current game.
    Keeps track of players and table information
*/

const Deck = require('./Deck');
const Hand = require('./Hand');

class GameState {
    constructor() {
        this.deck = new Deck; 
        this.dealer = null; 
        this.currPlayer = null;
        this.players = [];
        this.hands = [];
        this.tableCards = [];
        this.bet = -1;
        this.pot = -1;
        this.step = -1; 
        this.count = 0; 
        this.sockets = {};
    }

    resetGame() {
        // resets the game besides the players 
        this.dealer = null; 
        this.currPlayer = null;
        this.tableCards = [];
        this.bet = -1;
        this.pot = -1;
        this.step = -1; 
        this.count = 0; 
        // reset hands for any connected players
        let hand = { c1: -1, c2: -1 };
        for (var username in this.sockets) {
            this.sockets[username].emit('hand', { hand: hand });
        }
    }

    getPlayers() {
        // get all players in the game 
        return this.players;
    }

    addPlayer(player) {
        // adds a new player to the room
        this.players.push(player);
    }

    handlePlayerLeave() {
        // update the status of the game when a user leaves the game 
        // if all users leave, reset the game
        if (this.players.length < 2) {
            this.resetGame();
            return; 
        }
        // if the step is -1, we need to check if we're ready 
        if (this.step == -1 && this.checkReady()) {
            this.preFlop();
            return; 
        }
        // TODO if the user is the currPlayer/Dealer, need to change to next player 
        return; 
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
        this.handlePlayerLeave();
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

    preFlop() {
        // initial game state. no cards on table, every player gets 2 cards dealt
        this.step = 0; 
        this.deck.shuffle(); 
        // set the new dealer
        if (this.count > this.players.length-1) this.count = 0; 
        this.dealer = this.players[this.count];
        // set the currPlayer to one to the left of the dealer
        let currPlayerIndex = (this.count+1) % this.players.length; 
        this.currPlayer = this.players[currPlayerIndex];
        this.count++; 
        // draw cards for every player
        let hand;
        for (var i = 0; i < this.players.length; i++) {
            // do something 
            hand = new Hand(this.players[i].username); 
            hand.c1 = this.deck.draw();
            hand.c2 = this.deck.draw();
            console.log(this.players[i].username + ' drew ' + hand.c1 + ', ' + hand.c2);
            if (hand.c1 < 1 || hand.c2 < 1) {
                console.log(this.players[i].username + ' was dealt invalid cards');
                return false; 
            }  
            this.hands.push(hand);
            this.sockets[this.players[i].username].emit('hand', {hand: hand});
        }
        return true; 
    }
}

module.exports = GameState; 