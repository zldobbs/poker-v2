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
            <span></span>
        );
    }
}

export default ActionBar;