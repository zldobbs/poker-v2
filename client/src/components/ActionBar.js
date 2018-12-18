/*
    components/ActionBar.js

    Contains the buttons that a user may utilize during the game. 
    
    No Bet on Table                     Bet on Table
    ---------------                     --------------- 
        Bet                                 Raise
        Check                               Call
        Fold*                               Fold 

    *Could consider removing the fold button when there is no bet on the table
*/

import React, { Component } from 'react';
import 'materialize-css/dist/css/materialize.min.css';

class ActionBar extends Component {
    render() {
        return(
            <div className="col s6 m9 push-m2">
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
            </div>
        );
    }
}

export default ActionBar;