import React from 'react';
import $ from 'jquery';

import AppHeader from './AppHeader'

export default class ResetPassword extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      errors: []
    }
  }
  
  sendPassword = (e) => {
    e.preventDefault()
    let password = e.target.password.value
    let password_confirmation = e.target.password_confirmation.value

    if (password === password_confirmation) {
      var vars = {};
      var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
          vars[key] = value;
      });

      $.ajax({
      type: 'PUT',
      url: 'http://localhost:3000/auth/password',
      data: {
        password: password,
        password_confirmation: password_confirmation
      },
      headers: {
        access_token: vars.reset_password_token,
        client: 'http://localhost:3000',
        uid: 'nhughes987@gmail.com'
      }
    })
    } else {
      this.setState({
        errors: "Passwords did not match."
      })
    }
  }


  render () {    
    return (
      <div>
        <AppHeader />
        <form onSubmit={this.sendPassword} >
          
          <input name="password" placeholder="Password" type="password" autoComplete="new-password"/>
          <input name="password_confirmation" placeholder="Password Confirmation" type="password" autoComplete="password-confirmation"/>
          <input type="submit"/>
        </form>

      </div>
    )
  }
}