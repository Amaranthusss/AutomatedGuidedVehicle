const Module = require('../../Global/Modules').Module
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
    }
    white() {

    }
    red() {

    }
    custom() {

    }

}

brakeLight = new BrakeLight('Brake Light', pinout)
module.exports = { brakeLight: brakeLight }