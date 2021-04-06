import React, { useState } from 'react'
import { Button } from 'reactstrap'
import cmds from './commands'
import { Mic } from 'react-bootstrap-icons'

const SpeechRecognition = globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition

class Controller extends React.Component {
    constructor(props) {
        super(props)
        document.addEventListener("keydown", cmds._keyboardHandler) //Detection at all web page
        document.addEventListener("keyup", cmds._keyboardHandler) //Detection at all web page
        this.rec = new SpeechRecognition()
        this.rec.lang = 'pl-PL'
        this.rec.onstart = () => { console.log("Listening...") }
        this.rec.onresult = async event => {
            const current = event.resultIndex
            const transcript = event.results[current][0].transcript
            await cmds.readOut(transcript)
        }
        this.rec.onend = async () => {
            await this.rec.abort()
            await this.rec.stop()
            if (this.state.bttnColor === 'danger')
                await this.rec.start()
        }
        this.state = {
            bttnColor: 'primary'
        }
    }
    async startListening() {
        await this.rec.abort()
        await this.rec.stop()
        if (this.state.bttnColor === 'danger')
            await this.rec.start()
    }
    render() {
        return (
            <>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button id='upBttn' onKeyDownCapture={cmds._keyboardHandler} onKeyUpCapture={cmds._keyboardHandler}
                        onMouseDown={cmds._buttonHandler} onMouseUp={cmds._buttonHandler}>Forward</Button>
                </div> <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button id='leftBttn' onKeyDownCapture={cmds._keyboardHandler} onKeyUpCapture={cmds._keyboardHandler}
                        onMouseDown={cmds._buttonHandler} onMouseUp={cmds._buttonHandler}>Left</Button>
                    <Button id='rightBttn' onKeyDownCapture={cmds._keyboardHandler} onKeyUpCapture={cmds._keyboardHandler}
                        onMouseDown={cmds._buttonHandler} onMouseUp={cmds._buttonHandler}>Right</Button>
                </div> <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button id='downBttn' onKeyDownCapture={cmds._keyboardHandler} onKeyUpCapture={cmds._keyboardHandler}
                        onMouseDown={cmds._buttonHandler} onMouseUp={cmds._buttonHandler}>Backward</Button>
                </div>
                <Button style={{ float: 'right' }} color={this.state.bttnColor}
                    onClick={async () => {
                        await this.setState({ bttnColor: this.state.bttnColor === 'primary' ? 'danger' : 'primary' });
                        await this.startListening()
                    }}
                ><Mic color="white" /></Button>
            </>
        )
    }

}

export default Controller