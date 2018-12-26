/*
    components/PlayAction

    Contains the action buttons used to play the game (fold, bet, check, etc)
*/

import React, { Component } from 'react';
import 'materialize-css/dist/css/materialize.min.css';

class PlayAction extends Component {
    render() {
        return(
            <div className="row center">
                <div className="col s12 m3">
                    <button className="btn waves-effect action-btn redish">Fold</button>
                </div>
                <div className="col s12 m3">
                    <button className="btn waves-effect action-btn blueish-lt black-text">Check</button>
                </div>
                <div className="col s12 m3">
                    <button className="btn waves-effect action-btn blueish-dk">Bet</button>
                </div>
            </div>
        );
    }
}

export default PlayAction;