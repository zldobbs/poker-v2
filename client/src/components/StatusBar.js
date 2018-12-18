/*
    components/StatusBar.js

    Display the most recent update in the game room. 
*/

import React, { Component } from 'react';
import '../App.css';
import 'materialize-css/dist/css/materialize.min.css';

class StatusBar extends Component {
    render() {
        let msg;
        msg = this.props.loggedIn ? 'Logout' : 'Login / Register'; 
        return(
            <div id="status-bar" className="row blackish white-text z-depth-4">
                <div className="inline" id="status-bar">
                    <h3 className="inline">{this.props.status}</h3>
                </div>
                <div className="right valign-wrapper" onClick={this.props.handleClick}>
                    <p className="inline">{ msg }</p>
                </div>
            </div>
        ); 
    }
}

export default StatusBar;