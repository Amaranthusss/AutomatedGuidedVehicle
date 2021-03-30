const { Module } = require('../Module')
const pinout = require('../../config/pinout').brakeLight
const arduino = require('../Arduino').arduino

class BrakeLight extends Module {
    constructor(...params) {
        super(...params)
        this.hardware = {
            ...this.hardware,
            r: arduino.pinMode(pinout.r, 1),
            g: arduino.pinMode(pinout.g, 1),
            b: arduino.pinMode(pinout.b, 1)
        }
        this._getReady()
    }
    /**
    * Initialize lighting set color at strip.
    * @param color (Array) Basic color at RGB form. Example [255,120,0].
    * */
    set(color) {
        this.hardware.r.pwmWrite(pinout.r, color[0])
        this.hardware.g.pwmWrite(pinout.g, color[1])
        this.hardware.b.pwmWrite(pinout.b, color[2])
    }

}

brakeLight = new BrakeLight('Brake Light', pinout)
module.exports = { brakeLight: brakeLight }