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
        // the table's step is -1, we are at the initial phase 
        if (this.props.tableState.step === -1) {
            actions = (<ReadyAction handleReadyUpClick={this.props.handleReadyUpClick} ready={this.props.player.playing} />);
        }
        else if (this.props.tableState.currPlayer.username === this.props.player.username) {
            actions = (<PlayAction handleActionClick={this.props.handleActionClick} />);
        }
        else {
            actions = (<span></span>);
        }
        return(
            <div className="col s6 m9 push-m2 push-s2">
                { actions }
            </div>
        );
    }
}

export default ActionBar;