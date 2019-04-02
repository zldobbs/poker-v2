/*
    App.js

    Entry point for client. Handle frontend and communications to server. 
*/

import React, { Component } from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import './App.css';
import socketIOClient from 'socket.io-client';
import axios from 'axios';

// Component imports
import GameBoard from './components/GameBoard';
import StatusBar from './components/StatusBar';
import PlayersArea from './components/PlayersArea';
import UserArea from './components/UserArea';
import LoginPage from './components/LoginPage';

// Declare endpoint for server 
const endpoint = 'http://localhost:4000';

// Setup socket connection with backend 
const socket = socketIOClient(endpoint);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Status message to provide updates during the game
      statusMsg: 'Poker',
      // Table state manages the cards and bet information for the game 
      tableState: {
        dealer: null,
        currPlayer: null,
        tableCards: [],
        tableBet: -1,
        tablePot: -1,
        step: -1
      },
      // User is essentially a player
      user: null,
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
    this.handleReadyUpClick = this.handleReadyUpClick.bind(this);
    this.handleActionClick = this.handleActionClick.bind(this);
    this.switchViewToHome = this.switchViewToHome.bind(this);
  }

  handleLoginLinkClick() {
    // change the user's view to the login page
    if (this.state.loggedIn) {
      const updatedUser = { username: this.state.user.username, pot: this.state.user.pot };
      axios.post(`${endpoint}/api/accounts/logout`, updatedUser) 
      .then((res) => {
        if (res.data.err) {
          console.log(res.data.errText);
        }
        else {
          this.setState({ loggedIn: false });
        }
      })
      .catch((err) => {
        console.log(err);
      }); 
    }
    else {
      this.setState({ view: 'LoginPage', errorText: '' });  
    }
  }

  handleLoginClick(user) {
    // attempt to login the user
    if (user.username.length > 0 && user.password.length > 0) {
      axios.post(`${endpoint}/api/accounts/login`, user)
        .then((res) => {
          if (res.data.err) {
            this.setState({ errorText: res.data.errText });
          }
          else {
            this.setState({ 
              loggedIn: !this.state.loggedIn,
              user: res.data.user,
              view: 'GamePage' 
            });
            socket.emit('bind user', {username: res.data.user.username});
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    else {
      this.setState({ errorText: 'Please provide a valid username and password' });
    }
  }

  handleRegisterClick(user) {
    // attempt to register the user
    if (user.username.length > 0 && user.password.length > 0) {
      axios.post(`${endpoint}/api/accounts/register`, user)
        .then((res) => {
          if (res.data.err) {
            this.setState({ errorText: res.data.errText });
          }
          else {
            this.setState({ 
              loggedIn: !this.state.loggedIn,
              user: res.data.user,
              view: 'GamePage' 
            });
            socket.emit('bind user', {username: res.data.user.username});
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    else {
      this.setState({ errorText: 'Please provide a valid username and password' });
    }
  }

  handleReadyUpClick() {
    // handle users readying up to play the game 
    let user = this.state.user; 
    axios.post(`${endpoint}/api/game/ready`, user)
      .then((res) => {
        if (res.data.succ) {
          user.playing = res.data.user.playing;
          this.setState({ user: user });
        }
        else {
          console.log("Error: " + res.data.errText); 
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleActionClick(action, bet) {
    // handles a user's action (fold, check, or bet)
    const play = { user: this.state.user, action: action, bet: bet };
    axios.post(`${endpoint}/api/game/action`, play)
      .then((res) => {
        if (res.data.succ) {
          console.log('server acks play');
        }
        else {
          console.log('failed to play');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  switchViewToHome() {
    // switches the user's view to the home page (poker table) 
    this.setState({ view: 'GamePage' });
  }

  componentDidMount() {
    socket.on('who', (data) => {
      // updates on current players
      this.setState({ players: data.players });
      // need to also update the user's bank and bet information
      if (this.state.user) {
        for (var i = 0; i < data.players.length; i++) {
          if (this.state.user.username.toLowerCase() === data.players[i].username.toLowerCase()) {
            let user = this.state.user;
            user.bet = data.players[i].bet; 
            user.pot = data.players[i].pot; 
            this.setState({ user: user });
          }
        }
      }
    });

    socket.on('game state', (data) => {
      // updates the entire game state to reflect backend 
      this.setState({
        statusMsg: 'Poker',
        tableState: {
          dealer: data.game.dealer,
          currPlayer: data.game.currPlayer,
          tableCards: data.game.tableCards,
          tablePot: data.game.pot,
          tableBet: data.game.bet,
          step: data.game.step
        }
      });
      // check if there is a new winner
      if (data.game.winners.length > 0) {
        var winners = data.game.winners[0].hand.username;
        for (var i = 1; i < data.game.winners.length; i++) {
          winners += ', ' + data.game.winners[i].hand.username;
        }
        winners += ' has won the pot!';
        this.setState({ statusMsg: winners });
      }
    });

    socket.on('hand', (data) => {
      // updates the current user's hand
      let user = this.state.user;
      user.c1 = data.hand.c1;
      user.c2 = data.hand.c2;
      console.log('hand: ' + user.c1 + ', ' + user.c2);
      this.setState({ user: user });
    });

    socket.on('ready update', (data) => {
      // updates a user's playing status based on server changes
      let user = this.state.user;
      user.playing = data.ready; 
      this.setState({ user: user });
    });
  }

  render() {
    let view; 
    let playersView;
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
        if (this.state.loggedIn) {
          playersView = (
            <div>
              <PlayersArea 
                loggedIn={this.state.loggedIn}
                tableState={this.state.tableState} 
                players={this.state.players}>
              </PlayersArea>
              <UserArea 
                player={this.state.user} 
                tableState={this.state.tableState}
                handleReadyUpClick={this.handleReadyUpClick}
                handleActionClick={this.handleActionClick}>
              </UserArea>
            </div>
          );
        }
        else {
          playersView = (
            <PlayersArea loggedIn={this.state.loggedIn} players={this.state.players}></PlayersArea>
          )
        }
        view = (
          <div>        
            <StatusBar 
              handleClick={this.handleLoginLinkClick} 
              status={this.state.statusMsg} 
              loggedIn={this.state.loggedIn}>
            </StatusBar>
            <GameBoard tableState={this.state.tableState}></GameBoard>
            { playersView }
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
