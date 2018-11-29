/*
    components/GameBoard.js

    Display the current table cards, current pot, and bet. 
*/

import React, { Component } from 'react';
import 'materialize-css/dist/css/materialize.min.css';

// Component imports
import Card from './Card';

// Gameboard needs props that are equivalent to tableCards, tablePot, and currentBet
class GameBoard extends Component {
    render() {
        let tableCards, tableInfo;
        if (this.props.tableState.tableCards[0]) {
            // If we have at least one card, we should render them all 
            // This would mean that a game has started. Could be at any point in the game 
            // (i.e. not all cards need to be defined. If 0 is defined, 0-2 should all be defined)
            tableCards = (
                <div>
                    <Card id="card1" cardNum={this.props.tableState.tableCards[0]}></Card>
                    <Card id="card2" cardNum={this.props.tableState.tableCards[1]}></Card>
                    <Card id="card3" cardNum={this.props.tableState.tableCards[2]}></Card>
                    <Card id="card4" cardNum={this.props.tableState.tableCards[3]}></Card>
                    <Card id="card5" cardNum={this.props.tableState.tableCards[4]}></Card>        
                </div>
            );
            tableInfo = (
                <div>
                    <div className="col s6 center">
                        <p>Pot: ${this.props.tableState.tablePot}</p>
                    </div>
                    <div className="col s6 center">
                        <p>Current Bet: ${this.props.tableState.currentBet}</p>
                    </div>
                </div>
            );
        }
        else {
            // Seperate state should be used whenever not playing 
            tableCards = (
                <div>
                    <h3>Waiting to begin...</h3>
                </div>
            );
            tableInfo = (
                <span></span>
            );
        }
        return(
            <div className="container-fluid">
                <div className="row game-board">
                    <div className="col s12 m10 push-m1">

                        <div id="cardDisplay" className="row center">
                            { tableCards }
                        </div>

                        <div className="row">
                            { tableInfo }
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default GameBoard;