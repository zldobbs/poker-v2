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
        let players = this.props.players ? this.props.players : [];
        for (let i = 0; i < players; i++) {
            playerIcons.push(
                <PlayerIcon key={i} player={this.props.players[i]}></PlayerIcon>
            );
            console.log('pushed ' + this.props.players[i].username);
        }
        return(
            <div className="row center blueish-dk white-text z-depth-3">
                <div id="players-area">
                    { playerIcons }
                </div>
            </div>
        );
    }
}

export default PlayersArea;