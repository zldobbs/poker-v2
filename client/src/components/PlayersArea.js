/*
    components/PlayersArea.js

    Displays every player currently in the game. 
    This will only render players that are NOT the current user.
    Current user display will be handled in components/UserArea.js
*/

import React, { Component } from 'react';
import 'materialize-css/dist/css/materialize.min.css';

// Component imports 
import PlayerIcon from 'PlayerIcon.js'

class PlayersArea extends Component {
    render() {
        return(
            <span></span>
        );
    }
}

export default PlayersArea;