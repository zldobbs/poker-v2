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
            <div className="col s6 m9">
                <div className="row">
                    <div className="col s12 m3">
                        <button className="btn waves-effect action-btn">Fold</button>
                    </div>
                    <div className="col s12 m3">
                        <button className="btn waves-effect action-btn">Check</button>
                    </div>
                    <div className="col s12 m3">
                        <button className="btn waves-effect action-btn">Bet</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ActionBar;