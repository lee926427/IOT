import React, { Component } from 'react';
import BarChart from './BarChart';
import Paho from 'paho.mqtt.javascript';
import './App.css';

class App extends Component {
    
    state = {
        data:[{
                temp: 20.9,
                humidity: 40.6,
                time: '11:00'
            }, {
                temp: 23.2,
                humidity: 43.4,
                time: '12:00'
            }, {
                temp: 24.9,
                humidity: 44.2,
                time: '13:00'
            }, {
                temp: 26.0,
                humidity: 46.5,
                time: '14:00'
            }, {
                temp: 25.8,
                humidity: 45.4,
                time: '15:00'
            }, {
                temp: 25.4,
                humidity: 47.3,
                time: '16:00'
            }, {
                temp: 27.1,
                humidity: 50.2,
                time: '17:00'
            }, {
                temp: 20.9,
                humidity: 48.6,
                time: '18:00'
            }, {
                temp: 20.9,
                humidity: 49.8,
                time: '19:00'
            }, {
                temp: 20.9,
                humidity: 51.2,
                time: '20:00'
            }, {
                temp: 20.9,
                humidity: 50.9,
                time: '21:00'
            }, {
                temp: 20.9,
                humidity: 40.6,
                time: '22:00'
            }
        ],
        width: 700,
        height: 300,
        id:"root"
    };
    render() {
    return (
        <div className="App">
            <BarChart data={this.state.data} width={this.state.width} height={this.state.height}/>
        </div>
    );
  }
}

export default App;
