import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import PaymentsList from './PaymentsList';

class App extends Component {
  render() {
    return (
      <div className="App">
        <p className="App-intro">
          Main App Component. 
        </p>
        <PaymentsList />
      </div>
    );
  }
}

export default App;
