import React, { Component } from 'react';
import Header from './components/Header';
import Timer from './components/Timer';

class App extends Component {
  render() {
    return (
      <center>
        <Header />
        <Timer />
      </center>
    );
  }
}

export default App;
