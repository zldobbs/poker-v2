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
            <div className="row center blackish white-text z-depth-4">
                <div id="status-bar">
                    <h3>{this.props.status}</h3>
                </div>
            </div>
        ); 
    }
}

export default StatusBar;