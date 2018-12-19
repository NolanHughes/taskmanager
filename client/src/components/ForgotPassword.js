import React from 'react';
import $ from 'jquery';

import AppHeader from './AppHeader'

export default class ForgotPassword extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      errors: []
    }
  }

  sendPasswordEmail = (e) => {
    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/auth/password',
      data: {
        email: e.target.email.value,
        redirect_url: 'http://localhost:3000/resetpassword'
      }
    })
    .done((response) => {   
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
    return (
      <div>
        <AppHeader />
        <form onSubmit={this.sendPasswordEmail} >
          <input name="email" placeholder="Email" autoComplete="username"/>
          <input type="submit"/>
        </form>
      </div>
    )
  }
}



