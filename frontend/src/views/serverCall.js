/*
import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket('ws://127.0.0.1:8081');


class App extends Component {
    data = null
    componentWillMount() {
        client.onopen = () => {
            //console.log('WebSocket Client Connected')
        };
        client.onmessage = (message) => {
            console.log(message.data)
            this.data = message.data
        };
    }

    render() {
        return (
            <div>
                Message: {this.data}
            </div>
        );
    }
}

export default App; */