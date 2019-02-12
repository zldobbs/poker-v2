/*
    game_state/GameState

    Manages the status of the current game.
    Keeps track of players and table information
*/

const Deck = require('./Deck');
const Hand = require('./Hand');
const Score = require('./Score');

class GameState {
    constructor() {
        this.deck = new Deck;
        this.winners = [];
        this.dealer = null; 
        this.dealerIndex = -1;
        this.tempDealerIndex = -1; 
        this.startIndex = -1; 
        this.currPlayer = null;
        this.players = [];
        this.activePlayers = [];
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
        this.winners = [];
        this.dealer = null; 
        this.dealerIndex = -1;
        this.tempDealerIndex = -1;
        this.startIndex = -1; 
        this.currPlayer = null;
        this.tableCards = [];
        this.bet = -1;
        this.pot = -1;
        this.step = -1; 
        this.count = 0; 
        // reset players status to not playing
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].playing = false; 
        }
        this.activePlayers = [];
        // reset hands for any connected players
        let hand = { c1: -1, c2: -1 };
        for (var username in this.sockets) {
            this.sockets[username].emit('hand', { hand: hand });
            this.sockets[username].emit('ready update', { ready: false });
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
            this.step = 3;
            this.count = 999;
            this.updateTableState();
            return; 
        }
        // if the step is -1, we need to check if we're ready 
        if (this.step == -1 && this.checkReady()) {
            this.preFlop();
            return; 
        }
        return; 
    }

    removePlayer(player) {
        // removes given player from room
        // error if player is not in the room 
        let players = this.players;
        let playing = false; 
        for (var i = 0; i < players.length; i++) {
            if (player.username.toLowerCase() == players[i].username.toLowerCase()) {
                playing = players[i].playing;
                players.splice(i, 1);
            }
        }
        // remove from active players list as well if they applicable
        if (playing) {
            var index = (this.startIndex + this.count) % this.activePlayers.length;
            var activePlayers = this.activePlayers;
            var hands = this.hands; 
            for (var i = 0; i < activePlayers.length; i++) {
                if (hands[i] && player.username.toLowerCase() == hands[i].username.toLowerCase()) {
                    hands.splice(i, 1);
                    this.hands = hands; 
                }
                if (player.username.toLowerCase() == activePlayers[i].username.toLowerCase()) {
                    if (this.currPlayer && this.currPlayer.username.toLowerCase() == activePlayers[i].username.toLowerCase()) {
                        // user who left is the current player
                        this.handleFold(activePlayers[i]);
                        this.currPlayer = this.activePlayers[index];
                        this.updateTableState();
                    }
                    else {
                        activePlayers.splice(i, 1);
                        this.activePlayers = activePlayers;
                    }
                }
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
            if (this.players[i].username.toLowerCase() === username.toLowerCase()) {
                this.players[i].playing = !this.players[i].playing;
                return this.players[i]; 
            }
        }
        return null; 
    }

    setReady(username) {
        // sets the given user to playing
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].username.toLowerCase() === username.toLowerCase()) {
                this.players[i].playing = true;
                return this.players[i]; 
            }
        }
        return null; 
    }

    unsetReady(username) {
        // set the given user to not ready
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].username.toLowerCase() === username.toLowerCase()) {
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

    handleFold(user) {
        // NOTE may not be properly changing dealer when leaving.
        // notice some issues where one player will be skipped and another will get an extra turn after someone folds
        // handles a user folding, updates game state accordingly
        // count should not change here since active players will decrease 
        var index = (this.startIndex + this.count) % this.activePlayers.length;
        if (user.username.toLowerCase() == this.currPlayer.username.toLowerCase()) {
            this.activePlayers.splice(index, 1); 
            console.log(this.activePlayers);
            if (this.activePlayers.length <= 1) {
                // set step to 3 because updateTableStatus will be called 
                // this will send to awards
                this.count = 999;
                this.step = 3; 
            }
            else {
                if (index === this.tempDealerIndex) {
                    // if the 'current' dealer folds, update
                    this.tempDealerIndex = (this.tempDealerIndex - 1) % this.activePlayers.length;
                }
            }
        }
        else {
            console.log('Error: ' + user.username + ' tried to fold, but it is ' + this.activePlayers[index].username + ' turn');
        }
    }

    handleCheck(user) {
        // handles a user checking (or calling), updates game state accordingly
        // check if the correct user is attempting an action
        if (user.username.toLowerCase() == this.currPlayer.username.toLowerCase()) {
            // count increments since this is a valid play
            this.count++;     
        }
        else {
            // unauthorized 
            console.log(user.username + ' attempted to check, but it is ' + this.currPlayer.username + ' turn.');
        }
    }

    handleBet(user) {
        // TODO FIXME need a temporary dealer index to keep track of the current origin of play 
        // this 
        // handles a user betting (or raising), updates game state accordingly
        // FIXME player does not advance if the person betting is the first to play 
        if (user.username.toLowerCase() == this.currPlayer.username.toLowerCase()) {
            // count reset to 0, every active player gets a chance to play again 
            let index = (this.startIndex + this.count) % this.activePlayers.length;
            this.startIndex = index;
            this.count = 1; 
        }
        else {
            // unauthorized 
            console.log(user.username + ' attempted to bet, but it is ' + this.currPlayer.username + ' turn.');
        }
    }

    updateTableState() {
        // check if each player has had a turn to play
        if (this.count >= this.activePlayers.length) {
            // go to next step 
            this.step++; 
            this.count = 0;
            switch(this.step) {
                case 0:
                    // pre flop
                    this.preFlop();
                    break;
                case 1: 
                    // flop
                    // 3 cards are dealt to the table 
                    this.flop();
                    break;
                case 2:
                    // turn
                    // 1 card is dealt
                    this.turn();
                    break;
                case 3:
                    // river
                    // final card dealt
                    this.river();
                    break;
                case 4:
                    // score
                    this.awards();
                    break;
                default:
                    // pre game
                    break;
            }
        }
        else {
            // NOTE will not incrementing count during a fold affect indexing? 
            // updates the table state 
            let index = (this.startIndex + this.count) % this.activePlayers.length;
            // just change the curr player
            this.currPlayer = this.activePlayers[index];
        }
    }

    resetBet() {
        // resets the tables bet and pot
        this.bet = 100;
        this.pot = 0;
    }

    preFlop() {
        // initial game state. no cards on table, every player gets 2 cards dealt
        this.step = 0;
        this.winners = [];  
        this.resetBet();
        // reset cards
        this.tableCards = [];
        this.deck.shuffle(); 
        // all players are initially active
        this.activePlayers = this.players.slice();
        this.dealerIndex++; 
        if (this.dealerIndex > this.activePlayers.length-1) this.dealerIndex = 0; 
        this.dealer = this.activePlayers[this.dealerIndex];
        this.hands = [];
        // tempDealerIndex will track the origin of play during the current game
        this.tempDealerIndex = this.dealerIndex;
        // set the currPlayer to one to the left of the dealer
        let index = (this.dealerIndex + 1) % this.activePlayers.length; 
        // start index is the location of the first person that should play at the given step 
        this.startIndex = index;
        this.currPlayer = this.activePlayers[index];
        // draw cards for every player
        let hand;
        for (var i = 0; i < this.activePlayers.length; i++) {
            // do something 
            hand = new Hand(this.activePlayers[i].username); 
            hand.c1 = this.deck.draw();
            hand.c2 = this.deck.draw();
            console.log(this.activePlayers[i].username + ' drew ' + hand.c1 + ', ' + hand.c2);
            if (hand.c1 < 1 || hand.c2 < 1) {
                console.log(this.activePlayers[i].username + ' was dealt invalid cards');
                return false; 
            }  
            this.hands.push(hand);
            this.sockets[this.activePlayers[i].username].emit('hand', {hand: hand});
        }
        return true; 
    }

    flop() {
        this.step = 1; 
        this.resetBet();
        this.tableCards.push(this.deck.draw());
        this.tableCards.push(this.deck.draw());
        this.tableCards.push(this.deck.draw());
        // set the currPlayer to one to the left of the dealer
        let index = (this.tempDealerIndex + 1) % this.activePlayers.length; 
        this.startIndex = index; 
        this.currPlayer = this.activePlayers[index];
    }

    turn() {
        this.step = 2; 
        this.tableCards.push(this.deck.draw());
        let index = (this.tempDealerIndex + 1) % this.activePlayers.length; 
        this.startIndex = index; 
        this.currPlayer = this.activePlayers[index];
    }

    river() {
        this.step = 3; 
        this.tableCards.push(this.deck.draw());
        let index = (this.tempDealerIndex + 1) % this.activePlayers.length; 
        this.startIndex = index; 
        this.currPlayer = this.activePlayers[index];
    }

    awards() {
        var score = new Score;
        var username; 
        var activeHands = [];
        for (var i = 0; i < this.activePlayers.length; i++) {
            var j = 0; 
            if (this.hands.length > 0) {
                while (this.activePlayers[i].username.toLowerCase() != this.hands[j].username.toLowerCase() && j < this.hands.length) {
                    j++;
                }    
            }
            if (j < this.hands.length) {
                activeHands.push(this.hands[j]);
            }
            else {
                console.log('Error players hand not found: ' + this.activePlayers[i].username);
            }
        }
        this.winners = score.scoreGame(activeHands, this.tableCards);
        this.currPlayer = null;
         // reset players status to not playing
         for (var i = 0; i < this.players.length; i++) {
            this.players[i].playing = false; 
            username = this.players[i].username; 
            this.sockets[username].emit('ready update', { ready: false });
        }
        this.step = -1;
    }
}

module.exports = GameState; 