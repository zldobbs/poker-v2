/*
    model/Score.js

    Methods that handle scoring the game 
    TODO account for split pots when someone goes all-in

    NOTE
    score will be used to denote the hand the user has
    10. Royal Flush
    9. Straight Flush
    8. 4 of a Kind
    7. Full House
    6. Flush
    5. Straight
    4. Three of a Kind
    3. Two Pairs
    2. One pair
    1. High Card
*/

class Score {
    straightCheck(cards) {
        // checks if the given cards are a straight 
        
    }

    tieBreak(hands) {
        // breaks a tie between two hands 

    }

    scoreFlush(cards) {
        // scores a given flush. checks for a royal flush or straight flush as well 

    }

    scoreGame(hands, tableCards) {
        // score each hand, determine who the overall winner is 
        let cards; 
        let score; 
        // winners will be an array in case of a tie 
        let winners = [];
        let winner; 
        for (var i = 0; i < hands.length; i++) {
            cards = tableCards.slice();
            cards.push(hands[i].c1);
            cards.push(hands[i].c2);
            score = scoreHand(cards);
            // check if it is the new highest score 
            if (score.base >= winners[0].score.base) {
                if (score > winners[0].score.base) winners = [];
                winner = { hand: hands[i], score: score,  };
                winners.push(winner);
            }
        }
        if (winners.length > 1) tieBreak(winners);
        return winners; 
    }

    scoreHand(cards) {
        // scores an individual hand
        // cards13 is the base value of each card (ignore suit) 
        let cards13 = cards.slice();
        for (var i = 0; i < cards13.length; i++) {
            cards13[i] %= 13; 
            // since card value indexes start at 1, 0 needs to be converted to 13 
            if (cards13[i] == 0) cards13[i] = 13; 
        }
        // sort cards in ascending order
        cards.sort((a,b) => a-b);
        cards13.sort((a,b) => a-b);
        // base score, the hand a user has (SEE ABOVE FOR HAND SCORES)
        let score; 
        // kicker values to break ties 
        let kicker = [];
        let pairs = [], triples =[], singles = [];
        // loop through the hand looking at values to check for duplicate cards 
        let i = 0; 
        while (i < cards13.length) {
            // count the occurrences of the current card 
            var occurrences = cards13.reduce((n, val) => {
                return n + (val === cards13[i]);
            });
            switch(occurrences) {
                case 1:
                    // single card
                    singles.push(cards13[i]);
                    i++;
                    break;
                case 2:
                    // pair 
                    pairs.push(cards13[i]);
                    i += 2; 
                    break;
                case 3:
                    // 3 of a kind
                    triples.push(cards13[i]);
                    i += 3;
                    break;
                case 4:
                    // 4 of a kind
                    // since this is the best hand the user could have, return their score now 
                    score = { base: 8, data: [cards13[i]] }; 
                    break;
                default:
                    console.log('Error: user had ' + occurrences + ' of ' + cards13[i]);
                    score = { base: -1, data: [] };
                    break;
            }
        }
        if (score.base) return score; 
        // check for a full house 
        // check from the back since they will be the highest values 
        for (var j = triples.length - 1; j >= 0; j--) {
            for (var k = pairs.length - 1; k >=0; k--) {
                if (triples[j] != pairs[k]) {
                    score = { base: 7, data: [pairs[k], triples[j]] };
                    return score; 
                }
            }
        } 
        // check for a flush
        // arrays for each suit 
        let c = [], d = [], h = [], s = [];
        i = 0; 
        while (i < cards.length) {
            if (cards[i] <= 13) {
                // club
                c.push(cards[i]);
                i++;
            }
            else if (cards[i] <= 26) {
                // diamond
                d.push(cards[i]);
                i++;
            }
            else if (cards[i] <= 39) {
                // heart
                h.push(cards[i]);
                i++;
            }
            else {
                // at this point every remaining card should be a spade
                s = cards.slice(i, cards.length);
                i = cards.length; 
            }
        }
        // if any of the suits have more than 5 cards, score the hand 
        if (c.length >= 5) return scoreFlush(c);
        if (d.length >= 5) return scoreFlush(d);
        if (h.length >= 5) return scoreFlush(h);
        if (s.length >= 5) return scoreFlush(s);
        // check for a straight 
        let straight = straightCheck(cards13);
        if (straight.check == 1) {
            score = { base: 5, data: [straight.hc] };
            return score; 
        }
        // check for a 3 of a kind 
        if (triples.length > 0) {
            for (var j = cards13.length - 1; j >= 0; j--) {
                if (cards13[j] != triples[triples.length - 1]) {
                    kicker.push(cards13[j]);
                    if (kicker.length >= 2) { 
                        score = { base: 4, data: [triples[triples.length - 1], kicker[0], kicker[1]] };
                        return score; 
                    }
                }
            }
        }
        // check for pairs 
        if (pairs.length > 0) {
            // check for 2 pairs
            if (pairs.length > 1) {
                for (var j = cards13.length - 1; j >= 0; j--) {
                    if (cards13[j] != pairs[pairs.length - 1] && cards13[j] != pairs[pairs.length - 2]) {
                        score = { base: 3, data: [pairs[pairs.length - 1], pairs[pairs.length - 2], cards13[j]] };
                        return score; 
                    }
                }
            } 
            // user has only one pair 
            else {
                for (var j = cards13.length - 1; j >= 0; j--) {
                    if (cards13[j] != pairs[pairs.length - 1]) {
                        kicker.push(cards13[j]);
                        if (kicker.length >= 3) {
                            score = { base: 2, data: [pairs[pairs.length - 1], kicker[0], kicker[1], kicker[2]] };
                            return score; 
                        }
                    }
                }
            }
        }
        // at this point, the user only has a high card 
        score = { base: 1, data: cards13.splice(2, 5) };
        return score; 
    }
}

module.exports = Score;