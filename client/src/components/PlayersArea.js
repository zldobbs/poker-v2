/*
    components/PlayersArea.js

    Displays every player currently in the game. 
    This will only render players that are NOT the current user.
    Current user display will be handled in components/UserArea.js
*/

import React, { Component } from 'react';
import 'materialize-css/dist/css/materialize.min.css';

// Component imports 
import PlayerIcon from './PlayerIcon.js';

// Iterate through the players array and display their icon.
// Sort the icons based on who is still in the game. 
// Highlight the winning user's icon.
class PlayersArea extends Component {
    render() {
        let playerIcons = [];
        var dealer;
        var currPlayer; 
        let players = this.props.players ? this.props.players : [];
        for (let i = 0; i < players.length; i++) {
            dealer = false; 
            currPlayer = false; 
            if (this.props.tableState) {
                if (this.props.tableState.dealer && this.props.players[i].username === this.props.tableState.dealer.username) {
                    dealer = true; 
                }
                if (this.props.tableState.currPlayer && this.props.players[i].username === this.props.tableState.currPlayer.username) {
                    currPlayer = true; 
                }
            }
            playerIcons.push(
                <PlayerIcon key={i} player={this.props.players[i]} currPlayer={currPlayer} dealer={dealer}></PlayerIcon>
            );    
            console.log('pushed ' + this.props.players[i].username);
        }
        let area;
        if (this.props.loggedIn) {
            area = (
                <div id="short-players-area">
                    { playerIcons }
                </div>
            );
        }
        else {
            area = (
                <div id="full-players-area">
                    { playerIcons }
                </div>
            );
        }
        return(
            <div className="row center blueish-dk white-text">
                { area }
            </div>
        );
    }
}

export default PlayersArea;