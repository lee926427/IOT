import React, { Component } from 'react';
import Mqtt from './MQTT';
import 'bootstrap/dist/css/bootstrap.css';

class App extends Component {
    render() {
    return (
        <div className="App">
            <Mqtt />
        </div>
    );
  }
}

export default App;
