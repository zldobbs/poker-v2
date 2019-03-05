/*
    components/PlayerIcon.js

    A player's information. This will NOT be applied to the user.
    Should include profile pic, bank, bet
    If the user is still in the game, opacity full. Else fade their image
    Card images should be displayed upside down until after scoring.
*/

import React, { Component } from 'react';
import 'materialize-css/dist/css/materialize.min.css';

// Image imports. Only using default picture at the moment. 
const profileImageURL = require('../assets/img/blank-profile-picture.png');

// Pass into icon the player's cards, 
class PlayerIcon extends Component {
    render() {
        let classOption = 'player-profile-pic';
        if (this.props.currPlayer) classOption += ' currPlayer';
        let dealer = this.props.dealer ? <div id="dealer-chip" className="z-depth-1">D</div> : <span></span>;
        return(
            <div className="col m2 s6">
                <div className="player-icon">
                    <p className="player-username">{this.props.player.username}</p>{dealer}
                    <img className={classOption} src={profileImageURL} alt="profile-pic" />
                    <p>Bank: ${this.props.player.pot}</p>
                    <p>Bet: ${this.props.player.bet}</p>
                </div>
            </div> 
        );
    }
}

export default PlayerIcon;