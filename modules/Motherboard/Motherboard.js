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
            this.voltage = (this.hardware.voltageSensor.value * 5.015 / 1024) / (11000 / 33000)
        })
        this.hardware.currentSensor.on("change", () => {
            this.current = this.hardware.currentSensor.scaleTo(0, config.CURRENT_SENSOR_MAX_SCALE).toFixed(2)
        })
        /*this.hardware.dht.on("change", function () {
            console.log("celsius: ", this.thermometer.celsius,
                "relative humidity: ", this.hygrometer.relativeHumidity)
        })*/
        this.voltage = 0
        this.current = 0
        this.humidity = 0
        this.temperature = 0
        this.alarmDiodeStates = { lowVoltage: false }
        this.coolerStates = { raspiFan: false }
        this.diagVoltageInterval = setInterval(() => { this.getVoltage() }, 60000)
        this._getReady()
    }
    getVoltage() {
        this.alarmDiodeStates.lowVoltage = this.voltage <= config.LOW_LIMIT_AGV_VOLTAGE ? true : false
        let errorText = ''
        if (this.alarmDiodeStates.lowVoltage === true)
            errorText = `Error: Voltage lower than ${config.LOW_LIMIT_AGV_VOLTAGE}V`
        this._message(`Voltage: ${this.voltage}V. ${errorText}.`)
        this._alarmDiode()
        return this.voltage
    }
    _alarmDiode() {
        let error = Object.entries(this.alarmDiodeStates).find(el => el[1] == true)
        if (error) this.hardware.alarm.blink()
        else this.hardware.alarm.off()
        return this.alarmDiodeStates
    }
    getCurrent() {
        this._message(`Current: ${this.current}`)
        return this.current
    }
    setCooler(name, lvl) {
        this.coolerStates[name] = lvl
        this._cooling()
    }
    _cooling() {
        let cooling = Object.entries(this.coolerStates).find(el => el[1] == true)
        if (cooling) this.hardware.cooler.analogWrite(pinout.cooler.pwm, 255)
        else this.hardware.cooler.analogWrite(pinout.cooler.pwm, 0)
    }
}

motherboard = new Motherboard('Motherboard', pinout)
module.exports = { motherboard: motherboard }