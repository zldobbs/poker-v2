/*
    components/LoginPage

    Form for handling user login and register attempts
*/

import React, { Component } from 'react';
import 'materialize-css/dist/css/materialize.min.css';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usernameVal: '',
            passwordVal: ''
        }

        this.handleUsernameValChange = this.handleUsernameValChange.bind(this);
        this.handlePasswordValChange = this.handlePasswordValChange.bind(this);
        this.middlewareLogin = this.middlewareLogin.bind(this);
        this.middlewareRegister = this.middlewareRegister.bind(this);
    }

    handleUsernameValChange(e) {
        // keep track of the value in the username field
        this.setState({ usernameVal: e.target.value });
    }

    handlePasswordValChange(e) {
        // keep track of the value in the password field
        this.setState({ passwordVal: e.target.value });
    }

    middlewareLogin(e) {
        // gather the field inputs and pass to login function at top level
        e.preventDefault();
        let user = { username: this.state.usernameVal, password: this.state.passwordVal };
        this.props.handleLoginClick(user);
        this.setState({ usernameVal: '', passwordVal: '' });
    }

    middlewareRegister(e) {
        // gather the field inputs and pass to register function at top level
        e.preventDefault();
        let user = { username: this.state.usernameVal, password: this.state.passwordVal };
        this.props.handleRegisterClick(user);
        this.setState({ usernameVal: '', passwordVal: '' });
    }

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
                            <input type="text" id="username" value={this.state.usernameVal} onChange={this.handleUsernameValChange} className="validate"></input>
                            <label htmlFor="username" className="active">Username</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12 m6 push-m3">
                            <input type="password" value={this.state.passwordVal} onChange={this.handlePasswordValChange} className="validate"></input>
                            <label htmlFor="password" className="active">Password</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12 m2 push-m4">
                            <button onClick={this.middlewareRegister} className="btn action-btn blueish-lt black-text">Register</button>
                        </div>
                        <div className="col s12 m2 push-m4">
                            <button onClick={this.middlewareLogin} className="btn action-btn blueish-dk">Login</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default LoginPage;