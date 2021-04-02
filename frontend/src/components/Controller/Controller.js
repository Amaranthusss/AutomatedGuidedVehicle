import React from 'react'
import { Button } from 'reactstrap'
import axios from 'axios'

class Controller extends React.Component {
    constructor(props) {
        super(props)
        this.states = [
            { state: false, ref: '/upCmd', lastType: '' },
            { state: false, ref: '/downCmd', lastType: '' },
            { state: false, ref: '/leftCmd', lastType: '' },
            { state: false, ref: '/rightCmd', lastType: '' }
        ]
        document.addEventListener("keydown", this._keyboardHandler) //Detection at all web page
        document.addEventListener("keyup", this._keyboardHandler) //Detection at all web page
    }
    _keyboardHandler = async e => { //Key events have intervals so there was required transfer limit
        let id, object
        switch (e.key) { //One handler to all specified keys
            case 'w': id = 0; break
            case 's': id = 1; break
            case 'a': id = 2; break
            case 'd': id = 3; break
            default: return //Able to use only specified above keys
        }
        object = this.states[id] //Pick suitable state
        if (e.type === 'keydown')
            object.state = true
        else object.state = false
        if (object.lastType != e.type) //Command has to be different than previous
            axios.post(object.ref, { state: object.state })
        object.lastType = e.type //Backup current state
    }
    _buttonHandler = async e => {
        let id, object
        switch (e.target.id) { //One handler to all controller's buttons
            case 'upBttn': id = 0; break
            case 'downBttn': id = 1; break
            case 'leftBttn': id = 2; break
            case 'rightBttn': id = 3; break
        }
        object = this.states[id] //Pick suitable state
        if (e.type === 'mousedown')
            object.state = true
        else object.state = false
        await axios.post(object.ref, { state: object.state })
    }

    render() {
        return (
            <div>
                <Button id='upBttn' onKeyDownCapture={this._keyboardHandler} onKeyUpCapture={this._keyboardHandler}
                    onMouseDown={this._buttonHandler} onMouseUp={this._buttonHandler}>Forward</Button><br></br>
                <Button id='leftBttn' onKeyDownCapture={this._keyboardHandler} onKeyUpCapture={this._keyboardHandler}
                    onMouseDown={this._buttonHandler} onMouseUp={this._buttonHandler}>Left</Button>
                <Button id='rightBttn' onKeyDownCapture={this._keyboardHandler} onKeyUpCapture={this._keyboardHandler}
                    onMouseDown={this._buttonHandler} onMouseUp={this._buttonHandler}>Right</Button><br></br>
                <Button id='downBttn' onKeyDownCapture={this._keyboardHandler} onKeyUpCapture={this._keyboardHandler}
                    onMouseDown={this._buttonHandler} onMouseUp={this._buttonHandler}>Backward</Button>
            </div >
        )
    }

}

export default Controller