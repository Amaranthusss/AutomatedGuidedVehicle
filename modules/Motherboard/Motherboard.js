const Module = require('../../Global/Modules').Module
const pinout = require('../../config/pinout').motherboard
const { Led, Sensor } = require('johnny-five')
const arduino = require('../Arduino').arduino


class Motherboard extends Module {
    constructor(...params) {
        super(...params)
        this.hardware = {
            ...this.hardware,
            leftGreen: new LED(pinout.rj45Left.green),
            leftYellow: new LED(pinout.rj45Left.yellow),
            rightGreen: new LED(pinout.rj45Right.green),
            rightYellow: new LED(pinout.rj45Right.yellow),
            cooler: arduino.pinMode(pinout.cooler.pwm, 1),
            voltageSensor: new Sensor(pinout.voltageSensor.read),
            currentSensor: new Sensor(pinout.currentSensor.read),
            dht: new Sensor.Digital(pinout.dhtSensor)
        }
        voltageSensor.on("change", () => { console.log(voltageSensor.scaleTo(0, 13)) }) //DO KONFIGA PRZENIESC ZAKRES
        currentSensor.on("change", () => { console.log(currentSensor.scaleTo(0, 20)) })
        dht.on("change", () => { dht.log(this.value) })
    }

}

motherboard = new Motherboard('Motherboard', pinout)
module.exports = { motherboard: motherboard }