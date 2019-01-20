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
                    <div className="col s12 m8 push-m2 center">
                        <div className="row">
                            <div className="col m4 s12">
                                <div id="user-card-box" className="row">
                                    <div className="col s6 push-s2 push-m1">
                                        <Card cardNum={this.props.player.c1}></Card>
                                    </div>
                                    <div className="col s6">
                                        <Card cardNum={this.props.player.c2}></Card>
                                    </div>
                                </div>
                            </div>
                            <PlayerIcon player={this.props.player}></PlayerIcon>
                            <div className="col m4 s6">
                                <div className="row">
                                    <ActionBar 
                                        player={this.props.player}
                                        tableState={this.props.tableState} 
                                        handleReadyUpClick={this.props.handleReadyUpClick}
                                        handleActionClick={this.props.handleActionClick}>
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