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
      pot: 1000,
      bet: 100,
      card1: 17,
      card2: 39
    },
    // Players currently in the game
    players: []
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

    socket.on('who', (data) => {
      // updates on current players
      this.setState({
        players: data.players
      });
      console.log('Updated players: ' + this.state.players);
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
