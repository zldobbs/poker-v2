/*
    components/GameBoard.js

    Display the current table cards, current pot, and bet. 
*/

import React, { Component } from 'react';
import 'materialize-css/dist/css/materialize.min.css';

// Image uploads for cards
// Need to find more efficient way to handle the cards
import card1 from '../assets/img/cards/1.png';

// TODO on GameBoard
// Make card component, import and replace the img with that 
class GameBoard extends Component {
    render() {
        return(
            <div className="container-fluid">
                <div className="row game-board">
                    <div className="col s12 m10 push-m1">

                        <div className="row">
                            <div className="col m2 push-m1 s4">
                                <img className="responsive-img" src={card1} alt="1"></img>
                            </div>
                            <div className="col m2 push-m1 s4">
                                <img className="responsive-img" src={card1} alt="2"></img>
                            </div>
                            <div className="col m2 push-m1 s4">
                                <img className="responsive-img" src={card1} alt="3"></img>
                            </div>
                            <div className="col m2 push-m1 s4 push-s2">
                                <img className="responsive-img" src={card1} alt="4"></img>
                            </div>
                            <div className="col m2 push-m1 s4 push-s2">
                                <img className="responsive-img" src={card1} alt="5"></img>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col s6 center">
                                <p>Pot: $9000</p>
                            </div>
                            <div className="col s6 center">
                                <p>Bet: $0</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default GameBoard;