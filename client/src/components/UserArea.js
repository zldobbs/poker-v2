/*
    components/UserArea.js

    Displays the user's information.
    Profile pic, bank, bet, cards
*/

import React, { Component } from 'react';
import 'materialize-css/dist/css/materialize.min.css';

// Component imports 
import ActionBar from './ActionBar.js';
import PlayerIcon from './PlayerIcon.js';

class UserArea extends Component {
    render() {
        return(
            <div id="user-area" className="blackish white-text">
                <div className="row">
                    <div className="col s12 m6 push-m3 center">
                        <div className="row">
                            <PlayerIcon player={this.props.player}></PlayerIcon>
                            <ActionBar 
                                player={this.props.player}
                                tableState={this.props.tableState} 
                                handleReadyUpClick={this.props.handleReadyUpClick}>
                            </ActionBar>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserArea;