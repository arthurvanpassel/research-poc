import React, { Component } from 'react';
import './App.css';
import Home from './Components/Home';
import { Route } from 'react-router-dom';



class App extends Component {
  render() {
    return (
      <div>
        <Route exact path='/' component={Home} />
      </div>
    );
  }
}

export default App;
