const Module = require('../../Global/Modules').Module
const pinout = require('../../config/pinout').axises
const config = require('../../config/config').AXISES
const arduino = require('../Arduino').arduino
const { inRange } = require('../../Global/math')
const Gpio = require('pigpio').Gpio

class Axis extends Module {
    constructor(...params) {
        super(...params)
        this.hardware = {
            ...this.hardware,
            en: new Gpio(pinout.motor.EN, { mode: Gpio.OUTPUT }),
            dir: new Gpio(pinout.motor.DIRECTION, { mode: Gpio.OUTPUT }),
            step: new Gpio(pinout.motor.STEP, { mode: Gpio.OUTPUT }),
            a: arduino.pinMode(pinout.encoder.A, 0),
            b: arduino.pinMode(pinout.encoder.B, 0)
        }
        this.encoding = {
            lastState: null,
            a: null,
            b: null,
            i: 0,
            tEnd: [],
            dir: false
        }
        this.state = 'ready'
        arduino.digitalRead(this.hardware.a, value => { this.encoding.lastState = value })
        this.encodingInterval = setInterval(this._encodingLoop, config.ENCODING_INTERVAL)
        this.velocity = { freq: 0, speed: 0.0 }
    }
    _set(dir, en) {
        this.hardware.en.digitalWrite(en)
        this.hardware.dir.digitalWrite(dir)
        if (this.hardware.en.digitalRead() === config.ENABLE) //Acceleration
            this.velocity.freq = inRange(this.velocity.freq += config.RISING_FREQ_STEP, { max: config.MAX_PWM_FREQ, limit: true })
        else //Braking
            this.velocity.freq = inRange(this.velocity.freq -= config.FALLING_FREQ_STEP, { min: config.MIN_PWM_FREQ, limit: true })
        //Error diagnosis - frequency out of range
        inRange(this.velocity.freq, { min: config.MIN_PWM_FREQ, max: config.MAX_PWM_FREQ }) === false ?
            _message('Frequency out of range (' + this.velocity.freq +
                '), where [min: ' + config.MIN_PWM_FREQ + ', max: ' + config.MAX_PWM_FREQ + '].') : {}
        this.hardware.step.pwmFrequency(this.velocity.freq)
        this.hardware.step.pwmWrite(this.velocity.freq > config.MIN_PWM_FREQ ? config.PWM : 0)
        //V = ((2 * PI * r ) / 60) * (f / Res * 60) = 7.2 * PI * r * f / Res [km/h]
        this.velocity.speed = (7.2 * Math.PI * config.WHEELS_RADIUS * this.velocity.freq / (config.HARDWARE_PUL_PER_REV)).toFixed(2)
    }
    _encodingLoop() {
        let tSt = new Date().getTime()
        arduino.digitalRead(this.hardware.a, value => { this.encoding.a = value })
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
}

const controller = {
    leftFrontAxis: new Axis('Left Front', pinout.leftFront),
    leftRearAxis: new Axis('Left Rear', pinout.leftRear),
    rightFrontAxis: new Axis('Right Front', pinout.rightFront),
    rightRearAxis: new Axis('Right Rear', pinout.rightRear),
    goForward: () => {
        controller.leftFrontAxis._set(config.DIRECTION, config.ENABLE)
        controller.leftRearAxis._set(config.DIRECTION, config.ENABLE)
        controller.rightFrontAxis._set(config.DIRECTION, config.ENABLE)
        controller.rightRearAxis._set(config.DIRECTION, config.ENABLE)
    },
    turnLeft: () => {
        controller.leftFrontAxis._set(config.DIRECTION, !config.ENABLE)
        controller.leftRearAxis._set(config.DIRECTION, config.ENABLE)
        controller.rightFrontAxis._set(config.DIRECTION, !config.ENABLE)
        controller.rightRearAxis._set(config.DIRECTION, config.ENABLE)
    },
    turnRight: () => {
        controller.leftFrontAxis._set(config.DIRECTION, config.ENABLE)
        controller.leftRearAxis._set(config.DIRECTION, !config.ENABLE)
        controller.rightFrontAxis._set(config.DIRECTION, config.ENABLE)
        controller.rightRearAxis._set(config.DIRECTION, !config.ENABLE)
    },
    goBackward: () => {
        controller.leftFrontAxis._set(!config.DIRECTION, config.ENABLE)
        controller.leftRearAxis._set(!config.DIRECTION, config.ENABLE)
        controller.rightFrontAxis._set(!config.DIRECTION, config.ENABLE)
        controller.rightRearAxis._set(!config.DIRECTION, config.ENABLE)
    },
    reverseLeft: () => {
        controller.leftFrontAxis._set(!config.DIRECTION, !config.ENABLE)
        controller.leftRearAxis._set(!config.DIRECTION, config.ENABLE)
        controller.rightFrontAxis._set(!config.DIRECTION, !config.ENABLE)
        controller.rightRearAxis._set(!config.DIRECTION, config.ENABLE)
    },
    reverseRight: () => {
        controller.leftFrontAxis._set(!config.DIRECTION, !config.ENABLE)
        controller.leftRearAxis._set(!config.DIRECTION, config.ENABLE)
        controller.rightFrontAxis._set(!config.DIRECTION, !config.ENABLE)
        controller.rightRearAxis._set(!config.DIRECTION, config.ENABLE)
    },
    stop: () => {
        controller.leftFrontAxis._set(!config.DIRECTION, !config.ENABLE)
        controller.leftRearAxis._set(!config.DIRECTION, !config.ENABLE)
        controller.rightFrontAxis._set(!config.DIRECTION, !config.ENABLE)
        controller.rightRearAxis._set(!config.DIRECTION, !config.ENABLE)
    }
}

module.exports = controller