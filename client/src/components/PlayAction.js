/*
    components/PlayAction

    Contains the action buttons used to play the game (fold, bet, check, etc)
*/

import React, { Component } from 'react';
import 'materialize-css/dist/css/materialize.min.css';

class PlayAction extends Component {
    render() {
        // declare handleClick so that different actions can be passed up in one function
        // action = 0 -> user folds 
        // action = 1 -> user checks 
        // action = 2 -> user bets
        const handleClick = ((action) => (event) => this.props.handleActionClick(action));
        return(
            <div className="row center">
                <div className="col s12 m3">
                    <button onClick={handleClick(0)} className="btn waves-effect action-btn redish">Fold</button>
                </div>
                <div className="col s12 m3">
                    <button onClick={handleClick(1)} className="btn waves-effect action-btn blueish-lt black-text">Check</button>
                </div>
                <div className="col s12 m3">
                    <button onClick={handleClick(2)} className="btn waves-effect action-btn blueish-dk">Bet</button>
                </div>
            </div>
        );
    }
}

export default PlayAction;