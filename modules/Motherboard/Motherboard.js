const { Module } = require('../Module')
const pinout = require('../../config/pinout').motherboard
const { VOLTAGE_SENSOR, CURRENT_SENSOR } = require('../../config/config').MOTHERBOARD
const { Led, Sensor, Pin } = require('johnny-five')
const arduino = require('../Arduino').arduino
const controller = require('../Axises/Axises')
const { writeToFile } = require('../../global/jsonCtrl')
const { FOLDER } = require('../../config/config').RESEARCH

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
            currentSensor: new Sensor({ pin: pinout.currentSensor.read }),
            //dht: new Multi({ controller: "DHT11_I2C_NANO_BACKPACK" })
        }
        this.voltage = 0
        this.current = 0
        this.humidity = 0
        this.temperature = 0
        this.alarmDiodeStates = { lowVoltage: false }
        this.coolerStates = { raspiFan: false }
        this.diagVoltageInterval = setInterval(() => { this.getVoltage() }, 60000)
        this.hardware.voltageSensor.on("change", () => {
            this.voltage = ((this.hardware.voltageSensor.value * VOLTAGE_SENSOR.ARDUNIO_REFERENCE / 1024)
                / (VOLTAGE_SENSOR.LOWER_RESISTANCE / VOLTAGE_SENSOR.HIGHER_RESISTANCE) + VOLTAGE_SENSOR.VOLTAGE_OFFSET_CALIBRATION).toFixed(2)
        })
        this.hardware.currentSensor.on("change", () => {
            this.current = ((this.hardware.currentSensor.value * 5 / 1023 - 2.5) / 0.066 - CURRENT_SENSOR.CALIBRATION).toFixed(4)
            //this.current = this.hardware.currentSensor.fscaleTo(0, 30)
        })
        this.voltageHistory = []
        this.currentHistory = []
        this.frequencyHistory = []
        setTimeout(() => {
            writeToFile(FOLDER + '/history.json',
                {
                    voltage: this.voltageHistory,
                    current: this.currentHistory,
                    frequency: this.frequencyHistory,
                }
                , this)
            this._message('History has been wroten.')
        }, 120000);
        this._getReady()
    }
    getVoltage() {
        this.alarmDiodeStates.lowVoltage = this.voltage <= VOLTAGE_SENSOR.LOW_VOLTAGE_LEVEL ? true : false
        let errorText = ''
        if (this.alarmDiodeStates.lowVoltage === true)
            errorText = `ERROR: Voltage lower than ${VOLTAGE_SENSOR.LOW_VOLTAGE_LEVEL}V! `
        //this._message(`${errorText}Voltage: ${this.voltage}V`)
        this._alarmDiode()
        this.getCurrent()
        this.voltageHistory.push(this.voltage)
        this.currentHistory.push(this.current)
        this.frequencyHistory.push(controller.highestFreq)
        return this.voltage
    }
    _alarmDiode() {
        let error = Object.entries(this.alarmDiodeStates).find(el => el[1] == true)
        if (error) this.hardware.alarm.blink()
        else this.hardware.alarm.off()
        return this.alarmDiodeStates
    }
    getCurrent() {
        //this._message(`Current: ${this.current}A`)
        return this.current
    }
    setCooler(name, lvl) {
        this.coolerStates[name] = lvl
        this._cooling()
    }
    _cooling() {
        let cooling = Object.entries(this.coolerStates).find(el => el[1] == true)
        if (cooling) this.hardware.cooler.analogWrite(pinout.cooler.pwm, 255) //ToDo: 255 here
        else this.hardware.cooler.analogWrite(pinout.cooler.pwm, 0)
    }
}
motherboard = new Motherboard('Motherboard', pinout)
module.exports = { motherboard: motherboard }