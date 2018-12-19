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
import LoginPage from './components/LoginPage';

// Setup socket connection with backend 
const socket = socketIOClient('localhost:4000');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      players: [],
      // Is there a user logged in 
      loggedIn: false,
      // View settings 
      view: 'GamePage',
      // Optional error text
      errorText: ''
    };

    this.handleLoginLinkClick = this.handleLoginLinkClick.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleRegisterClick = this.handleRegisterClick.bind(this);
    this.switchViewToHome = this.switchViewToHome.bind(this);
  }

  handleLoginLinkClick() {
    // change the user's view to the login page
    if (this.state.loggedIn) {
      this.setState({ loggedIn: false });
    }
    else {
      this.setState({ view: 'LoginPage', errorText: '' });  
    }
  }

  handleLoginClick(user) {
    // attempt to login the user
    if (user.username.length > 0 && user.password.length > 0) {
      socket.emit('login', user);
    }
    else {
      this.setState({ errorText: 'Please provide a valid username and password' });
    }
  }

  handleRegisterClick(user) {
    // attempt to register the user
    if (user.username.length > 0 && user.password.length > 0) {
      socket.emit('register', user);
    }
    else {
      this.setState({ errorText: 'Please provide a valid username and password' });
    }
  }

  switchViewToHome() {
    // switches the user's view to the home page (poker table) 
    this.setState({ view: 'GamePage' });
  }

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
    });

    socket.on('login success', (data) => {
      // update user display on successful login 
      // set user info here
      this.setState({ view: 'GamePage', loggedIn: true });
    });

    socket.on('login error', (err) => {
      // if user fails to log in, set an error message
      this.setState({ errorText: err.text });
    });
  }

  render() {
    let view; 
    console.log('Rendering view: ' + this.state.view);
    switch(this.state.view) {
      case 'LoginPage': 
        view = (
          <LoginPage 
            errorText={this.state.errorText} 
            handleLoginClick={this.handleLoginClick} 
            handleRegisterClick={this.handleRegisterClick}
            switchViewToHome={this.switchViewToHome}>
          </LoginPage>
        );
        break;
      case 'GamePage':
      default: 
        view = (
          <div>        
            <StatusBar 
              handleClick={this.handleLoginLinkClick} 
              status={this.state.statusMsg} 
              loggedIn={this.state.loggedIn}>
            </StatusBar>
            <GameBoard tableState={this.state.tableState}></GameBoard>
            <PlayersArea players={this.state.players}></PlayersArea>
            <UserArea player={this.state.user}></UserArea>
          </div>
        );
        break;
    }
    return (
      <div className="container-fluid blackish"> 
        { view }
      </div>      
    );
  }
}

export default App;
