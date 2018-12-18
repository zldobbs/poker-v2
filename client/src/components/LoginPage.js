/*
    components/LoginPage

    Form for handling user login and register attempts
*/

import React, { Component } from 'react';
import 'materialize-css/dist/css/materialize.min.css';

class LoginPage extends Component {
    render() {
        let errorMessage;
        if (this.props.errorText === '') {
            errorMessage = (<span></span>);
        }
        else {
            errorMessage = (
                <div id="login-error-message" className="row">
                    <div className="col s12 m6 push-m3 z-depth-1 redish">
                        <p>{this.props.errorText}</p>
                    </div>
                </div>
            );
        }
        return(
            <div id="login-page" className="container white-text">
                <div className="row">
                    <div onClick={this.props.switchViewToHome} id="login-back-btn" className="col s12 m3">
                        <p>Home</p>
                    </div>
                    <div className="col s12 m6 center">
                        <h1>Login</h1>
                    </div>
                </div>
                { errorMessage }
                <form onSubmit={this.props.handleLoginClick}>
                    <div className="row">
                        <div className="col s12 m6 push-m3">
                            <input type="text" className="validate input-field"></input>
                            <label>Username</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12 m6 push-m3">
                            <input type="password" className="validate input-field"></input>
                            <label>Password</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12 m2 push-m4">
                            <button onClick={this.props.handleRegisterClick} className="btn action-btn blueish-lt black-text">Register</button>
                        </div>
                        <div className="col s12 m2 push-m4">
                            <button onClick={this.props.handleLoginClick} className="btn action-btn blueish-dk">Login</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default LoginPage;