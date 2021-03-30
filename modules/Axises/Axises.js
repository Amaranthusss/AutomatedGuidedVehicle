const { Module } = require('../Module')
const pinout = require('../../config/pinout').axises
const config = require('../../config/config').AXISES
const arduino = require('../Arduino').arduino
const { inRange } = require('../../Global/math')
const { _cmdRead } = require('./commands')
const { Pin } = require('johnny-five')
const Gpio = require('pigpio').Gpio

class Axis extends Module {
    constructor(...params) {
        super(...params)
        this.hardware = {
            ...this.hardware,
            en: new Gpio(this.hardware.pinout.motor.en, { mode: Gpio.OUTPUT }),
            dir: new Gpio(this.hardware.pinout.motor.dir, { mode: Gpio.OUTPUT }),
            step: new Gpio(this.hardware.pinout.motor.step, { mode: Gpio.OUTPUT }),
            a: arduino.pinMode(this.hardware.pinout.encoder.a, Pin.INPUT),
            b: arduino.pinMode(this.hardware.pinout.encoder.b, Pin.INPUT)
        }
        this.encoding = {
            lastState: null,
            a: null,
            b: null,
            i: 0,
            tEnd: [],
            dir: false
        }
        this.hardware.en = config.ENABLE
        this.hardware.step.pwmFrequency(0)
        this.hardware.step.pwmWrite(0)
        this.velocity = { freq: 0, speed: 0.0, previousCmds: [], previousVels: [] }
        //arduino.digitalRead(this.hardware.pinout.encoder.a, value => { this.encoding.lastState = value })
        //this.encodingInterval = setInterval(() => this._encodingLoop(), config.ENCODING_INTERVAL)
        this._getReady()
    }
    _encodingLoop() {
        let tSt = new Date().getTime()
        arduino.digitalRead(this.hardware.pinout.encoder.a, value => { this.encoding.a = value })
        if (this.encoding.a != this.encoderState) {
            this.encoding.tEnd.push(Date().getTime - tSt)
            arduino.digitalRead(this.hardware.b, value => { this.encoding.b = value })
            if (this.encoding.b != this.encoding.a) {
                this.encoding.i++
                this.encoding.dir = true
            }
            else {
                this.encoding.i--
                this.encoding.dir = false
            }
            console.log('i', this.encoding.i, 'tEnd', this.encoding.tEnd)
        }
        this.encoderState = this.encoding.a
    }
    drive(cmd) {
        this.hardware.en.digitalWrite(_cmdRead(this.name, cmd).en)
        this.hardware.dir.digitalWrite(_cmdRead(this.name, cmd).dir)
        if (this.hardware.en.digitalRead() === config.ENABLE) //Acceleration
            this.velocity.freq = inRange(this.velocity.freq += config.RISING_FREQ_STEP, { max: config.MAX_PWM_FREQ, limit: true })
        else //Braking
            this.velocity.freq = inRange(this.velocity.freq -= config.FALLING_FREQ_STEP, { min: config.MIN_PWM_FREQ, limit: true })
        //Error diagnosis - frequency out of range
        inRange(this.velocity.freq, { min: config.MIN_PWM_FREQ, max: config.MAX_PWM_FREQ }) === false ?
            this._message('Frequency out of range (' + this.velocity.freq +
                '), where [min: ' + config.MIN_PWM_FREQ + ', max: ' + config.MAX_PWM_FREQ + '].') : {}
        this.hardware.step.pwmFrequency(this.velocity.freq)
        this.hardware.step.pwmWrite(this.velocity.freq > config.MIN_PWM_FREQ ? config.PWM : 0)
        //V = ((2 * PI * r ) / 60) * (f / Res * 60) = 7.2 * PI * r * f / Res [km/h]
        this.velocity.speed = (7.2 * Math.PI * config.WHEELS_RADIUS * this.velocity.freq / (config.HARDWARE_PUL_PER_REV)).toFixed(2)
        let output = [this.velocity.speed, cmd]
        return output
    }
}

class Controller extends Module {
    constructor(...params) {
        super(...params)
        this.leftFrontAxis = new Axis('Left Front', pinout.leftFront)
        this.leftRearAxis = new Axis('Left Rear', pinout.leftRear)
        this.rightFrontAxis = new Axis('Right Front', pinout.rightFront)
        this.rightRearAxis = new Axis('Right Rear', pinout.rightRear)
        this.history = []
    }
    goForward() {
        this.history.push(this.leftFrontAxis.drive('forward'))
    }
    turnLeft() {
        this.history.push(this.leftFrontAxis.drive('turnLeft'))
    }
    turnRight() {
        this.history.push(this.leftFrontAxis.drive('turnRight'))
    }
    goBackward() {
        this.history.push(this.leftFrontAxis.drive('backward'))
    }
    reverseLeft() {
        this.history.push(this.leftFrontAxis.drive('reverseLeft'))
    }
    reverseRight() {
        this.history.push(this.leftFrontAxis.drive('reverseRight'))
    }
    stop() {
        this.history.push(this.leftFrontAxis.drive())
    }
}
const controller = new Controller()
module.exports = controller