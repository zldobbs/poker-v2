/*
    components/StatusBar.js

    Display the most recent update in the game room. 
*/

import React, { Component } from 'react';
import '../App.css';
import 'materialize-css/dist/css/materialize.min.css';

class StatusBar extends Component {
    render() {
        return(
            <div className="row status-bar center indigo darken-4 white-text">
                <h3>{this.props.status}</h3>
            </div>
        ); 
    }
}

export default StatusBar;