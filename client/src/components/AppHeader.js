import React from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';

import '../css/Navbar.css'

export default class AppHeader extends React.Component { 
	componentDidMount () {
		debugger
		if (sessionStorage.user) {
			$.ajax({
				type: 'GET',
				url: `${this.props.apiUrl}/auth/validate_token`,
	      dataType: "JSON",
	      headers: JSON.parse(sessionStorage.getItem('user'))
			})
			.fail((data) => {
				debugger
				this.props.history.push('/login');
			})
		}
	}

	handleSignOut = (e) => {
		e.preventDefault();

		$.ajax({
			type: 'DELETE',
			url: `${this.props.apiUrl}/auth/sign_out`,
			data: JSON.parse(sessionStorage.user)
		})
		.done(() => {
			sessionStorage.removeItem('user');
			this.props.history.push('/login');			
		})
	}

	render () {
		if(sessionStorage.getItem('user')) {
			let userName = JSON.parse(sessionStorage.getItem('user')).name
			
			return (
				<div className="Navbar">       
			    <nav className="Navbar__Items Navbar__Items--left">
				      <h2 className="">
				        Meyer & O'Connor
				      </h2>
			        <button id="category1" className="Navbar__Link Navbar__Items--selected"value="1" onClick={this.props.handleCategoryChange}>
			        	Marketing
			        </button>

			      	<button id="category2" className="Navbar__Link Navbar__Items--not-selected" value="2" onClick={this.props.handleCategoryChange}>
			      		Management
			      	</button>
			    </nav>

			    <nav className="Navbar__Items Navbar__Items--right">
			      <div className="">
			        <p>
								<span className="userId-navbar">Welcome {userName}</span>
								<button className="navbar-buttons sign-out" onClick={this.handleSignOut} >Sign out</button>
							</p>
			      </div>
			    </nav>
			  </div>
			)
		} else {
			return (
				<div className="Navbar">       
			    <nav className="Navbar__Items Navbar__Items--left">
				    <h2 className="">
				      The Task Manager
				    </h2>
			    </nav>

			    <nav className="Navbar__Items Navbar__Items--right">
			      <div className="Navbar__Link">
			      	<Link className="navbar-buttons" to='/Login'>Log In</Link>
							<Link className="navbar-buttons" to='/Signup'>Sign Up</Link>
			      </div>
			    </nav>
			  </div>
			)
		}
	}
}

AppHeader.defaultProps = {
  // apiUrl: 'http://localhost:3000'
  apiUrl: 'https://thetaskmanager.herokuapp.com'  
};

