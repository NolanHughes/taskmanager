import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Tasks from './Tasks';
// import Login from './Login'
// import Signup from './Signup'
import '../css/App.css'

// export default (props) => {
// 	return(
// 		<Switch>			
// 			<Route exact path="/" component={Tasks} />
// 			<Route path="/login" component={Login} />
// 			<Route path="/signup" component={Signup} />
// 		</Switch>
// 	)
// }

import NotFound from './NotFound'

class App extends Component {
  render () {
    return <Router>
      <Switch>
        <Route path='/' exact component={Tasks} />

        <Route component={NotFound} />
      </Switch>
    </Router>
  }
}

export default App
