const { Module } = require('../Module')
const pinout = require('../../config/pinout').motherboard
const config = require('../../config/config').MOTHERBOARD
const { Led, Sensor, Multi, Pin } = require('johnny-five')
const arduino = require('../Arduino').arduino
var dht = require("node-dht-sensor")


class Motherboard extends Module {
    constructor(...params) {
        super(...params)
        this.hardware = {
            ...this.hardware,
            leftGreen: new Led(pinout.rj45Left.green),
            leftYellow: new Led(pinout.rj45Left.yellow),
            rightGreen: new Led(pinout.rj45Right.green),
            rightYellow: new Led(pinout.rj45Right.yellow),
            alarm: new Led(pinout.errorDiode.state),
            cooler: arduino.pinMode(pinout.cooler.pwm, Pin.PWM),
            voltageSensor: new Sensor(pinout.voltageSensor.read),
            currentSensor: new Sensor(pinout.currentSensor.read),
            //dht: new Multi({ controller: "DHT11_I2C_NANO_BACKPACK" })
        }
        this.hardware.voltageSensor.on("change", () => {
            this.voltage = this.hardware.voltageSensor.scaleTo(0, config.VOLTAGE_SENSOR_MAX_SCALE)
        })
        this.hardware.currentSensor.on("change", () => {
            this.current = this.hardware.currentSensor.scaleTo(0, config.CURRENT_SENSOR_MAX_SCALE)
        })
        /*this.hardware.dht.on("change", function () {
            console.log("celsius: ", this.thermometer.celsius,
                "relative humidity: ", this.hygrometer.relativeHumidity)
        })*/
        this.voltage = 0
        this.current = 0
        this.humidity = 0
        this.temperature = 0
        this.hardware.cooler.analogWrite(pinout.cooler.pwm, 255)
        this._getReady()
    }
    _alarmDiode() {
        let state = [false]
        state[0] = this.voltage <= config.LOW_LIMIT_AGV_VOLTAGE ? true : false
        let error = state.find(el => el === true)
        if (error) this.hardware.alarm.blink()
        return state
    }
    getVoltage() {
        let errorText = ''
        if (this._alarmDiode()[0] === true)
            errorText = `Error: Voltage lower than ${config.LOW_LIMIT_AGV_VOLTAGE}V`
        this._message(`Voltage: ${this.voltage}. ${errorText}.`)
        return this.voltage
    }
    getCurrent() {
        this._message(`Current: ${this.current}`)
        return this.current
    }

}

motherboard = new Motherboard('Motherboard', pinout)
module.exports = { motherboard: motherboard }