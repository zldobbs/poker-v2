/*
    components/PlayAction

    Contains the action buttons used to play the game (fold, bet, check, etc)
*/

import React, { Component } from 'react';
import 'materialize-css/dist/css/materialize.min.css';

class PlayAction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bet: 100,
            pot: this.props.playerPot,
            tableBet: this.props.tableBet
        }

        this.increaseBet = this.increaseBet.bind(this);
        this.decreaseBet = this.decreaseBet.bind(this);
    }

    /*
        increasing and decreasing bets by a constant amount 
        checking on both frontend and backend for valid bet amounts 
        TODO make bet amount editable text to allow for easier changes 
    */

    increaseBet() {
        let { bet } = this.state; 
        bet += 10; 
        // can't have a bet that is greater than the user's money pot 
        if (this.state.pot >= bet) {
            this.setState({ bet: bet });
        }
    }

    decreaseBet() {
        let { bet } = this.state;
        bet -= 10; 
        console.log(bet);
        console.log(this.state.tableBet);
        // can't have a bet lower than 0 or the current bet amount  
        if (this.state.tableBet <= bet) {
            this.setState({ bet: bet });
        }
    }

    render() {
        // declare handleClick so that different actions can be passed up in one function
        // action = 0 -> user folds 
        // action = 1 -> user checks 
        // action = 2 -> user bets
        const handleClick = ((action, bet) => (event) => this.props.handleActionClick(action, bet));
        return(
            <div className="row center">
                <div className="col s12">
                    <button onClick={handleClick(0, -1)} className="btn waves-effect action-btn redish">Fold</button>
                </div>
                <div className="col s12">
                    <button onClick={handleClick(1, this.state.tableBet)} className="btn waves-effect action-btn blueish-lt black-text">Check</button>
                </div>
                <div className="col s12">
                    <button onClick={handleClick(2, this.state.bet)} className="btn waves-effect action-btn blueish-dk">Bet</button>
                </div>
                <div className="col s4 center">
                    <button className="btn-floating btn-small action-btn redish" onClick={this.decreaseBet}><i className="material-icons">keyboard_arrow_down</i></button>
                </div>
                <div className="col s4 center valign-wrapper">
                    <p id="bet-text">${this.state.bet}</p>
                </div>
                <div className="col s4 center">
                    <button className="btn-floating btn-small action-btn redish" onClick={this.increaseBet}><i className="material-icons">keyboard_arrow_up</i></button>
                </div>
            </div>
        );
    }
}

export default PlayAction;