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

import PlayAction from './PlayAction';
import ReadyAction from './ReadyAction';

class ActionBar extends Component {
    render() {
        let actions;
        // the table's pot being set to -1 is a flag for initial game state
        if (this.props.tableState.tablePot === -1) {
            actions = (<ReadyAction />);
        }
        else if (this.props.tableState.currPlayer.username === this.props.player.username) {
            actions = (<PlayAction />);
        }
        else {
            actions = (<span></span>);
        }
        return(
            <div className="col s6 m9 push-m2">
                { actions }
            </div>
        );
    }
}

export default ActionBar;