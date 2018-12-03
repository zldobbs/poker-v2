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
        return(
            <div className="row center blueish-dk white-text z-depth-3">
                <div id="players-area">
                    <PlayerIcon player={this.props.players[0]}></PlayerIcon>
                    <PlayerIcon player={this.props.players[1]}></PlayerIcon>
                    <PlayerIcon player={this.props.players[2]}></PlayerIcon>
                    <PlayerIcon player={this.props.players[3]}></PlayerIcon>
                    <PlayerIcon player={this.props.players[4]}></PlayerIcon>
                    <PlayerIcon player={this.props.players[5]}></PlayerIcon>
                </div>
            </div>
        );
    }
}

export default PlayersArea;