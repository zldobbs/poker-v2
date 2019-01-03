/* 
    model/Deck

    Virtual model of the card deck
    Structure of cards based on integers: 
    - order: 2,3,4,...,Ace => 1,2,3,...,13
    - suits: 1-13  => Clubs
             14-26 => Diamonds
             27-39 => Hearts
             40-52 => Spades
*/

class Deck {
    // Played will constitute every card currently in play from the deck
    constructor() {
        this.played = [];
    }

    shuffle() {
        // resets deck
        this.played = [];
    }

    draw() {
        // draws a new card from the deck 
        console.log('drawing cards');
        var val = -1; 
        console.log('played length: ' + this.played.length);
        if (this.played.length >= 52) {
            return -1;
        }
        // check if new val is within the currently played cards
        while (this.played.indexOf(val) >= 0 || val == -1) {
            val = (Math.floor(Math.random() * 52) + 1);
        }
        console.log('val = ' + val);
        this.played.push(val);
        console.log('played = ');
        console.log(this.played);
        return val; 
    }
}  

module.exports = Deck;