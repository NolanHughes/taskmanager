import React, { Component } from 'react';
import './css/App.css';
import TasksContainer from './components/TasksContainer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Hello There!</h1>
        </header>
        <TasksContainer />
      </div>
    );
  }
}

export default App;
