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
        // FIXME need to account for player leaving mid game 
        if (this.players.length < 2) {
            this.resetGame();
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
            // TODO if the user is the currPlayer/dealer, need to change to next player 
            let activePlayers = this.activePlayers;
            for (var i = 0; i < activePlayers.length; i++) {
                if (player.username.toLowerCase() == activePlayers[i].username.toLowerCase()) {
                    activePlayers.splice(i, 1);
                }
            }
            this.activePlayers = activePlayers;
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

    handleFold(user) {
        // handles a user folding, updates game state accordingly
        // count should not change here since active players will decrease 
        if (user.username == this.currPlayer.username) {
            this.activePlayers.splice(index, 1); 
            this.updateTableState();
        }
        else {
            console.log('Error: ' + user.username + ' tried to fold, but it is ' + this.activePlayers[index].username + ' turn');
        }
        // TODO handle when the user folds mid game
        // account for when the last player folds and there is only 1 person left
        // should do all of this in handlePlayerLeave?
        // no, whenever a user leaves the game, call this function as though they had just folded 
        // then call the removeplayer function. although this could get confusing if they are not the 
        // currplayer 
    }

    handleCheck(user) {
        // handles a user checking (or calling), updates game state accordingly
        // check if the correct user is attempting an action
        if (user.username == this.currPlayer.username) {
            // count increments since this is a valid play
            this.count++; 
            this.updateTableState();    
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
        if (user.username == this.currPlayer.username) {
            // count reset to 0, every active player gets a chance to play again 
            let index = (this.startIndex + this.count) % this.activePlayers.length;
            this.startIndex = index;
            this.count = 1;
            this.updateTableState(); 
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
                    this.preFlop();
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
            console.log('dealer=' + this.tempDealerIndex + ', ' + this.dealer.username);
            console.log('start of play=' + this.startIndex + ', ' + this.activePlayers[this.startIndex]);
            console.log('curr=' + index + ', ' + this.currPlayer.username);
        }
        console.log('cards: ' + this.tableCards);
    }

    resetBet() {
        // resets the tables bet and pot
        this.bet = 100;
        this.pot = 0;
    }

    preFlop() {
        // initial game state. no cards on table, every player gets 2 cards dealt
        this.step = 0;  
        this.resetBet();
        // reset cards
        this.tableCards = [];
        this.deck.shuffle(); 
        // all players are initially active
        this.activePlayers = this.players.slice();
        this.dealerIndex++; 
        if (this.dealerIndex > this.activePlayers.length-1) this.dealerIndex = 0; 
        this.dealer = this.activePlayers[this.dealerIndex];
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
}

module.exports = GameState; 