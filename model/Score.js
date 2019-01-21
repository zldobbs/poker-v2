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
        // NOTE this function expects cards to be sent in their mod 13 version
        // i.e. suit should be ignored. only values 1-13 should be seen in the parameter 
        let streak = 0; 
        let check = 0; 
        let highCard = 0; 
        for (var i = 0; i < cards.length - 1; i++) {
            if ((cards[i] + 1) == cards[i+1]) {
                streak++;
                if (streak >= 4) {
                    // straight found
                    highCard = cards[i+1]; 
                    check = 1; 
                }
            }
            else if (cards[i] == 4 && streak >= 3) {
                // handle the case where the ace is low in the straight 
                for (var j = i + 1; j < cards.length; j++) {
                    if (cards[j] == 13) {
                        streak++;
                        if (streak >= 4) {
                            // highCard should always be 4 here 
                            highCard = 4;
                            check = 1; 
                        }
                    }
                } 
            }
            else {
                streak = 0; 
            }
        }
        let result = { check: check, hc: highCard };
        return result; 
    }

    tieBreak(hands) {
        // breaks a tie between two hands 
        let best = [];
        let quit = 0; 
        let j = 0; 
        best.push(hands[0]);
        for (var i = 1; i < hands.length; i++) {
            quit = 0; 
            j = 0; 
            while (j < best[0].score.data.length && quit == 0) {
                // loop through kicker cards to break the tie 
                if (best[0].score.base < hands[i].score.base || best[0].score.data[j] < hands[i].score.data[j]) {
                    quit = 1; 
                    best = [hands[i]];
                }
                else if (best[0].score.data[j] == hands[i].score.data[j]) {
                    if (j == best[0].score.data.length - 1) {
                        // an unbreakable tie has been found 
                        quit = 1; 
                        best.push(hands[i]);
                    }
                    j++; 
                }
                else {
                    quit = 1; 
                }
            }
        }
        return best; 
    }

    scoreFlush(cards) {
        // scores a given flush. checks for a royal flush or straight flush as well 
        // check if the flush is a straight 
        let straight = this.straightCheck(cards);
        var score; 
        if (straight.check == 1) {
            if (straight.hc == 13) {
                // royal flush  
                score = { base: 10, data: [] };
            }  
            else {
                // straight flush
                score = { base: 9, data: [straight.hc] };
            }
        }
        else {
            // flush (no straight)
            score = { base: 6, data: [cards[cards.length - 1]] };
        }
        return score; 
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
        var score; 
        // kicker values to break ties 
        let kicker = [];
        let pairs = [], triples = [], singles = [];
        // loop through the hand looking at values to check for duplicate cards 
        var i = 0; 
        while (i < cards13.length) {
            // count the occurrences of the current card 
            var num = cards13[i]; 
            var occurrences = 0; 
            while (i < cards13.length && cards13[i] == num) {
                i++;
                occurrences++; 
            }
            // FIXME decrement to get right value. update again after
            i--;
            switch(occurrences) {
                case 1:
                    // single card
                    singles.push(cards13[i]);
                    break;
                case 2:
                    // pair 
                    pairs.push(cards13[i]);
                    break;
                case 3:
                    // 3 of a kind
                    triples.push(cards13[i]);
                    break;
                case 4:
                    // 4 of a kind
                    // since this is the best hand the user could have, return their score now 
                    score = { base: 8, data: [cards13[i]] }; 
                    break;
                default:
                    console.log('Error: user had ' + occurrences + ' of ' + cards13[i]);
                    score = { base: -1, data: [] };
                    i = cards13.length + 1;
                    break;
            }
            i++;
        }
        if (score) return score; 
        // check for a full house 
        // check from the back since they will be the highest values 
        for (var j = triples.length - 1; j >= 0; j--) {
            for (var k = pairs.length - 1; k >=0; k--) {
                if (triples[j] != pairs[k]) {
                    score = { base: 7, data: [triples[j], pairs[k]] };
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
        if (c.length >= 5) return this.scoreFlush(c);
        if (d.length >= 5) return this.scoreFlush(d);
        if (h.length >= 5) return this.scoreFlush(h);
        if (s.length >= 5) return this.scoreFlush(s);
        // check for a straight 
        let straight = this.straightCheck(cards13);
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
        score = { base: 1, data: cards13.splice(2, 5).sort((a,b) => b-a) };
        return score; 
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
            score = this.scoreHand(cards);
            // set original high score 
            if (winners.length == 0) {
                winner = { hand: hands[i], score: score,  };
                winners.push(winner);
            }
            // check if it is the new highest score 
            else if (score.base >= winners[0].score.base) {
                if (score.base > winners[0].score.base) winners = [];
                winner = { hand: hands[i], score: score,  };
                winners.push(winner);
            }
        }
        if (winners.length > 1) winners = this.tieBreak(winners);
        return winners; 
    }
}

module.exports = Score;