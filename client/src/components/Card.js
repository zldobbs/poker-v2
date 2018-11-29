/*
    components/Card.js

    A single card image. Obtains url from game board. 
    Structure of card images should be noted: 
    - order: 2,3,4,...,Ace => 1,2,3,...,13
    - suits: 1-13  => Clubs
             14-26 => Diamonds
             27-39 => Hearts
             40-52 => Spades
*/

import React, { Component } from 'react';
import 'materialize-css/dist/css/materialize.min.css';

class Card extends Component {
    render() {
        const { cardNum } = this.props;
        let cardImageURL;
        let cardImage; 

        // Only load an image if there is a card at this spot
        if (cardNum) {
            cardImageURL = require(`../assets/img/cards/${cardNum}.png`);  
            cardImage = (<img className="responsive-img" src={cardImageURL} alt="1"></img>);
        }
        else {
            cardImage = (<span></span>);
        }
        return(
            <div className="col m2 push-m1 s4">
                { cardImage }
            </div>
        );
    }
}

export default Card;