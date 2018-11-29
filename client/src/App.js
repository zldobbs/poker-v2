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
  componentDidMount() {
    // Socket connection test
    socket.on('welcome', (message) => {
      console.log(message.text);
    });
  }

  render() {
    return (
      <div className="container-fluid">
        <StatusBar status="Poker"></StatusBar>
        <GameBoard></GameBoard>
      </div>      
    );
  }
}

export default App;
