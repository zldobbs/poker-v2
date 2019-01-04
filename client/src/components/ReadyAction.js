/*
    components/ReadyAction

    Contains the ready button used to start the game 
*/

import React, { Component } from 'react';
import 'materialize-css/dist/css/materialize.min.css';

class ReadyAction extends Component {
    render() {
        let button;
        console.log('ready: ' + this.props.ready);
        if (this.props.ready) {
            button = (<button onClick={this.props.handleReadyUpClick} className="btn waves-effect action-btn whiteish black-text">Ready</button>);
        }
        else {
            button = (<button onClick={this.props.handleReadyUpClick} className="btn waves-effect action-btn redish">Ready Up</button>);
        }
        return(
            <div className="row center">
                <div className="col s12 m8 push-m2">
                    { button }
                </div>
            </div>
        );
    }
}

export default ReadyAction;