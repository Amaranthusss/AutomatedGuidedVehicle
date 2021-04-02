import React from 'react'
import { Button } from 'reactstrap'
import client from '../../server/clientWebSocket'
import axios from 'axios'


class Controller extends React.Component {
    constructor(props) {
        super(props)
    }
    forwardEvent = async e => {
        let state
        if (e.type === "mousedown") state = true
        else state = false
        await axios.post('/forwardCmd', { state: state })
    }
    backwardEvent = async e => {
        let state
        if (e.type === "mousedown") state = true
        else state = false
        await axios.post('/backwardCmd', { state: state })
    }
    leftEvent = async e => {
        let state
        if (e.type === "mousedown") state = true
        else state = false
        await axios.post('/leftCmd', { state: state })
    }
    rightEvent = async e => {
        let state
        if (e.type === "mousedown") state = true
        else state = false
        await axios.post('/rightCmd', { state: state })
    }

    render() {
        return (
            <div>
                <Button onMouseDown={this.forwardEvent} onMouseUp={this.forwardEvent}>Forward</Button><br></br>
                <Button onMouseDown={this.leftEvent} onMouseUp={this.leftEvent}>Left</Button>
                <Button onMouseDown={this.rightEvent} onMouseUp={this.rightEvent}>Right</Button><br></br>
                <Button onMouseDown={this.backwardEvent} onMouseUp={this.backwardEvent}>Backward</Button>
            </div >
        )
    }

}

export default Controller