/*
    App.js

    Entry point for client. Handle frontend and communications to server. 
*/

import React, { Component } from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import './App.css';
import socketIOClient from 'socket.io-client';

// Component imports
import GameBoard from './components/GameBoard';
import StatusBar from './components/StatusBar';
import PlayersArea from './components/PlayersArea';
import UserArea from './components/UserArea';

// Setup socket connection with backend 
const socket = socketIOClient('localhost:4000');

class App extends Component {
  state = {
    // Status message to provide updates during the game
    statusMsg: 'Poker',
    // Table state manages the cards and bet information for the game 
    tableState: {
      tableCards: [],
      tablePot: 0,
      currentBet: 0,
    },
    // User is essentially a player
    user: {
      username: 'Zach',
      totalMoney: 1000,
      currentBet: 100,
      c1: 17,
      c2: 39
    },
    // Players currently in the game
    players: [
      {
        username: 'Jim',
        totalMoney: 0,
        currentBet: 100,
        c1: 1,
        c2: 5
      },
      {
        username: 'Hank',
        totalMoney: 6570,
        currentBet: 100,
        c1: 41,
        c2: 45
      },
      {
        username: 'Sally',
        totalMoney: 120,
        currentBet: 100,
        c1: 31,
        c2: 25
      },
      {
        username: 'Sam',
        totalMoney: 2220,
        currentBet: 100,
        c1: 11,
        c2: 51
      },
      {
        username: 'Johnny',
        totalMoney: 19,
        currentBet: 10,
        c1: 14,
        c2: 50
      },
      {
        username: 'Kimmy',
        totalMoney: 10,
        currentBet: 1200,
        c1: 13,
        c2: 52
      }
    ]
  };

  componentDidMount() {
    // Socket connection test
    socket.on('welcome', (message) => {
      console.log(message.text);
      this.setState({
        tableState: {
          tableCards: [1,4,8,12,13],
          tablePot: 10,
          currentBet: 10
        }
      });
    });
  }

  render() {
    return (
      <div className="container-fluid">
        <StatusBar status={this.state.statusMsg}></StatusBar>
        <GameBoard tableState={this.state.tableState}></GameBoard>
        <PlayersArea players={this.state.players}></PlayersArea>
        <UserArea player={this.state.user}></UserArea>
      </div>      
    );
  }
}

export default App;
