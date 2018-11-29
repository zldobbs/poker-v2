/*
    App.js

    Entry point for client. Handle frontend and communications to server. 
*/

import React, { Component } from 'react';
import './App.css';
import 'materialize-css/dist/css/materialize.min.css';
import socketIOClient from 'socket.io-client';

// Component imports
import StatusBar from './components/StatusBar';
import GameBoard from './components/GameBoard';

// Setup socket connection with backend 
const socket = socketIOClient('localhost:4000');

class App extends Component {
  state = {
    // Table state manages the cards and bet information for the game 
    tableState: {
      tableCards: [],
      tablePot: 0,
      currentBet: 0,
    }
  };

  componentDidMount() {
    // Socket connection test
    socket.on('welcome', (message) => {
      console.log(message.text);
      this.setState({
        tableState: {
          tableCards: [1],
          tablePot: 10,
          currentBet: 10
        }
      });
    });
  }

  render() {
    return (
      <div className="container-fluid">
        <StatusBar status="Poker"></StatusBar>
        <GameBoard tableState={this.state.tableState}></GameBoard>
      </div>      
    );
  }
}

export default App;
