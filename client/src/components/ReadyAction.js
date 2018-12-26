/*
    components/ReadyAction

    Contains the ready button used to start the game 
*/

import React, { Component } from 'react';
import 'materialize-css/dist/css/materialize.min.css';

class ReadyAction extends Component {
    render() {
        return(
            <div className="row center">
                <div className="col s12 m8 push-m2">
                    <button className="btn waves-effect action-btn redish">Ready Up</button>
                </div>
            </div>
        );
    }
}

export default ReadyAction;