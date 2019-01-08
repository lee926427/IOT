import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './style/mqttStyle.css';

class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: new Date(),
            weekly: ["Sunday", "Monday", "Tuesday", "Wednesday",
                "Thursday", "Friday", "Saturday"]
        };
    }

    componentDidMount() {
        this.interval = setInterval(() => this.tick(), 1000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    tick() {
        this.setState({
            time: new Date()
        });
    }
    render() {
        return (
            <div>
                <h1>Every Moment</h1>
                <div id="calendar">
                    <p id="date" className="font">{this.state.time.getDate()}</p>
                    <p id="month" className="font">{this.state.time.getFullYear()}/{this.state.time.getMonth() + 1}</p>
                    <p id="weekday" className="font">{this.state.weekly[this.state.time.getDate() % 6 + 1]}</p>
                    <p id="time_now" className="font">{this.state.time.toLocaleTimeString().split("¤W¤È")}</p>
                </div>
            </div>
        );
    }
}
    


export default Timer;
