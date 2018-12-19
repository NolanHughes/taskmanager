import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Tasks from './Tasks';
import Login from './Login'
import Signup from './Signup'
import '../css/App.css'

export default (props) => {
	return(
		<Switch>			
			<Route exact path="/" component={Tasks} />
			<Route path="/login" component={Login} />
			<Route path="/signup" component={Signup} />
		</Switch>
	)
}