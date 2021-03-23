const Module = require('../../Global/Modules').Module
const pinout = require('../../config/pinout').controlPanel
const { Switch } = require('johnny-five')
const arduino = require('../Arduino').arduino


class ControlPanel extends Module {
    constructor(...params) {
        super(...params)
        this.hardware = {
            ...this.hardware,
            btn1: new Switch(pinout.bttn1),
            btn2: new Switch(pinout.bttn2),
            btn3: new Switch(pinout.bttn3),
            btn4: new Switch(pinout.bttn4),
            btn5: new Switch(pinout.bttn5)
        }
        arduino.repl.inject({ toggle: toggle })
        btn1.on("close", open('btn1'))
        btn1.on("open", close('btn1'))
        btn2.on("close", open('btn2'))
        btn2.on("open", close('btn2'))
        btn3.on("close", open('btn3'))
        btn3.on("open", close('btn3'))
        btn4.on("close", open('btn4'))
        btn4.on("open", close('btn4'))
        btn5.on("close", open('btn5'))
        btn5.on("open", close('btn5'))
    }
    open(btn) {
        console.log(btn, 'has been opened')
    }
    close(btn) {
        console.log(btn, 'has been closed')
    }

}

controlPanel = new ControlPanel('Ctrl Panel', pinout)
module.exports = { controlPanel: controlPanel }