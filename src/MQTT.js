import React, { Component } from 'react';
import mqtt from 'mqtt';
import Switch from 'react-switch';
import BarChart from './BarChart';
import Time from './Timer';
import { Container, Row, Col, Jumbotron } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './style/mqttStyle.css';
import { RegExp } from 'core-js';


class Mqtt extends Component {
    options = {
        host: '',
        port: 3000,
        username: '',
        isSSL: false,
        password: '',
        keepalive: 60,
        clean: true,
        clientId: '',
        subQos: 0,
        publishQos: 0,
        publishMessage: 'Hello world!',
        subTopic: ['Home/Light/1', 'Home/Temperature/1',],//之後訂閱溫濕感測
        publishTopic: ['Home/Light/1',],//發布消息給LED
        publishRetain: false,
        receivedMessages: [],
        publishedMessages: [],
        subscriptions: [],
    }
    constructor() {
        super();
        this.state = {
            checked: false,
            data: [{
                topic: "Home/Temperature/1",
                date: '2019-01-06',
                data: [{
                    class: "Temperature",
                    record: [
                        { time: 1546587745, data: 24 },
                        { time: 1546587806, data: 24 },
                        { time: 1546587867, data: 24 },
                        { time: 1546587927, data: 24.1 },
                        { time: 1546587988, data: 24 },
                        { time: 1546588048, data: 24.1 },
                        { time: 1546588109, data: 24.3 },
                        { time: 1546588169, data: 24.2 },
                        { time: 1546588233, data: 24.1 },
                        { time: 1546588296, data: 24.2 },
                        ]
                }, {
                    class: "Humidity",
                    record: [
                        { time: 1546587745, data: 67.7 },
                        { time: 1546587806, data: 65.9 },
                        { time: 1546587867, data: 65.7 },
                        { time: 1546587927, data: 65.8 },
                        { time: 1546587988, data: 65.4 },
                        { time: 1546588048, data: 65.3 },
                        { time: 1546588109, data: 62.5 },
                        { time: 1546588169, data: 66.5 },
                        { time: 1546588233, data: 65.8 },
                        { time: 1546588296, data: 66.4 },
                    ]
                },
            ],
        }],
            width: window.innerWidth * 0.45,
            height: window.innerHeight * 0.35,
        };
        this.handleChange = this.handleChange.bind(this);
        console.log(process.env.NODE_ENV)
    }

    //client = mqtt.connect(`ws://localhost`, this.options)
    client = mqtt.connect(`ws://192.168.137.10`, this.options);

    handleChange(checked) {
        this.setState({ checked });
        this.connectMQ(checked);
    }
    
    connectMQ(status) {
        let client = this.client;
        let subscribeTopic = this.options.subTopic;
        let publishTopic = this.options.publishTopic;
        
        client.on('reconnect', (error) => {
            console.log('正在重連:', error)
        })

        client.on('error', (error) => {
            console.log('連接失敗:', error)
        })
        client.on('connect', function () {
            console.log('connected')
            client.subscribe(subscribeTopic, function (err) {
                client.publish(subscribeTopic, `web client subscribe ${subscribeTopic}`);
            })
        })
        client.on('message', (topic, msg) => {
            console.log('from web', `${topic}\n${msg.toString('utf8')}`)
            //============
            let re =new RegExp("update")
            if (re.test(topic)) {
                this.setState({ data:msg.toString('utf8')});
            }
            //============
        });
        if (status) {
            client.publish(subscribeTopic, JSON.stringify(`turn on`));
        } else {
            client.publish(subscribeTopic, JSON.stringify(`turn off`));
        }
    }
    componentDidMount() {
        this.connectMQ();
    }
    render() {
        return (
            <div className="mqtt">
                <Container>
                    <Row>
                        <Col>
                            <Jumbotron fluid>
                                <Container fluid>
                                    <Time />
                                </Container>
                            </Jumbotron>
                        </Col>
                        <Col xs="4" md="12">
                            <div>
                                <Jumbotron fluid>
                                    <Container fluid>
                                        <BarChart id="temp" data={this.state.data[0].data} width={this.state.width} height={this.state.height} />
                                    </Container>
                                </Jumbotron>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="6">
                            <Jumbotron fluid>
                                <Container fluid>
                                    <h1 className="display-3">MQTT</h1>
                                    <p>Default Topic: Home/Light/1</p>
                                    <input id="topic" placeholder="Topic" />
                                    <Switch
                                        onChange={this.handleChange}
                                        checked={this.state.checked}
                                        className="react-switch"
                                        id="normal-switch"
                                    />
                                    <div>Light is: {this.state.checked ? 'on' : 'off'}</div>
                                    <p className="lead"></p>
                                </Container>
                            </Jumbotron>
                        </Col>
                        <Col xs="6">
                            <Jumbotron fluid>
                                <Container fluid>
                                    <h6 className="display-3">Sensor</h6>
                                    <div>The temperature is over limit,light will open</div>
                                    <input id="limit" placeholder="Default limit:28" />
                                    <p className="lead"></p>
                                </Container>
                            </Jumbotron>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Mqtt;

