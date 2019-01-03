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
import Card from './Card.js';

class UserArea extends Component {
    render() {
        console.log('user cards: ' + this.props.player.c1 + ', ' + this.props.player.c2);
        return(
            <div id="user-area" className="blackish white-text">
                <div className="row">
                    <div className="col s12 m6 push-m3 center">
                        <div className="row">
                            <PlayerIcon player={this.props.player}></PlayerIcon>
                            <div className="col m10 s6">
                                <div id="user-card-box" className="row">
                                    <Card cardNum={this.props.player.c1}></Card>
                                    <Card cardNum={this.props.player.c2}></Card>
                                </div>
                                <div className="row">
                                    <ActionBar 
                                        player={this.props.player}
                                        tableState={this.props.tableState} 
                                        handleReadyUpClick={this.props.handleReadyUpClick}>
                                    </ActionBar>    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserArea;