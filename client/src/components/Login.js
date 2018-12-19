import React from 'react';
import { Link } from 'react-router-dom'
import $ from 'jquery';

import AppHeader from './AppHeader'


export default class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      errors: []
    }
  }

  handleLogin = (e) => {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: `${this.props.apiUrl}/auth/sign_in`,
      data: {
        email: this.email.value,
        password: this.password.value
      }
    })
    .done((response, status, jqXHR) => {
      sessionStorage.setItem("user",
        JSON.stringify({
          'access-token': jqXHR.getResponseHeader('access-token'),
          client: jqXHR.getResponseHeader('client'),
          uid: response.data.uid,
          name: response.data.name
        })
      );
      this.props.history.push('/')
    })
    .fail((response) => {
      let errors = response.responseJSON.errors

      this.setState({
        errors: errors
      })
    });

  }

  render () {
    let counter = 0

    let errors = this.state.errors.map( error => {
      ++counter
      return(<p key={counter}>{error}</p>)
    })
    return (
      <div>
        <AppHeader />
        <div className="container">
          <div className="tasks" id="sign-in">
            <div className="login-errors">
              {errors}
            </div>
            <h2>Sign in</h2>
            <form onSubmit={this.handleLogin} >
              <input name="email" placeholder="Email" autoComplete="username" ref={(input) => this.email = input} />
              <input name="password" placeholder="Password" type="password" autoComplete="current-password" ref = {(input) => this.password = input} />
              <button type="submit">Login</button>
            </form>
            {/*<Link to="ForgotPassword">Forgot Password</Link>*/}
          </div>
        </div>
      </div>
    )
  }
}

Login.defaultProps = {
  apiUrl: 'http://localhost:3000'
  // apiUrl: 'https://thetaskmanager.herokuapp.com'
};