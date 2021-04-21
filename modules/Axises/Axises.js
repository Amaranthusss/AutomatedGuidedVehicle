const { Module } = require('../Module')
const pinout = require('../../config/pinout').axises
const config = require('../../config/config').AXISES
const arduino = require('../Arduino').arduino
const { _cmdRead } = require('./commands')
const { Pin } = require('johnny-five')
const Gpio = require('pigpio').Gpio
const { states } = require('./controllerStates')

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
        this.hardware.en.digitalWrite(!config.ENABLE)
        this.velocity = { freq: 0, speed: 0.0 }
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
        //If velocity is too low for torsions turn off slower motors
        let reCmd = cmd === null ? undefined : cmd
        let freqI = config.FREQ_ARRAY.findIndex(el => el == this.velocity.freq)
        let halfFreq = config.FREQ_ARRAY[Math.floor(freqI / 2)]
        if (this.velocity.freq < halfFreq)
            if (cmd === 'goLeft')
                reCmd = 'turnLeft'
            else if (cmd === 'goRight')
                reCmd = 'turnRight'
        //Pick specified configuration for movement
        this.hardware.en.digitalWrite(_cmdRead(this.name, reCmd).en)
        this.hardware.dir.digitalWrite(_cmdRead(this.name, reCmd).dir)
        //Overwrite frequency if this is motor at torsion (slowed)
        if (['goLeft', 'goRight', 'reverseLeft', 'reverseRight'].some(e => e === reCmd) && _cmdRead(this.name, reCmd).torsion)
            this.velocity.freq = halfFreq
        else {
            //Increase velocity of this axis about constant step
            this.velocity.freq = states.stopAccelerating !== false ? config.FREQ_ARRAY[freqI] :
                config.FREQ_ARRAY[freqI < config.FREQ_ARRAY.length - 1 - states.maxSpeed ? freqI + 1 : freqI]
        }
        //Active acceleration or istant braking
        if (reCmd !== undefined) { //Acceleration
            if (this.hardware.step.getPwmFrequency() != this.velocity.freq)
                this.hardware.step.pwmFrequency(this.velocity.freq)
            let pwm = this.hardware.step.getPwmFrequency() >= config.MEDIUM_PWM_FREQ_MIN ? config.PWM_MEDIUM : config.PWM_LOW
            this.hardware.step.pwmWrite(pwm)
            this._freqToSpeed()
        } else { //Braking
            this.velocity.freq = config.FREQ_ARRAY[0]
            this._freqToSpeed()
            this.hardware.step.pwmFrequency(0)
            this.hardware.step.pwmWrite(0)
        }
        controller.highestFreq = this.velocity.freq //Information for displaying at frontend about the highest frequency
        let output = [controller.highestFreq, reCmd]
        // console.log(this.name, '[',
        //     this.hardware.step.getPwmFrequency(), 'Hz ] [',
        //     //this.hardware.step.getPwmDutyCycle(), 'pwm ] [',
        //     this.velocity.speed, 'km/h ] [',
        //     this.velocity.freq, 'Hz[set] ] [',
        //     this.hardware.en.digitalRead(), 'en ] [',
        //     this.hardware.dir.digitalRead(), 'dir ] [',
        //     states.stopAccelerating, 'stopAcce ] [',
        //     reCmd, cmd, ' ]'
        // )
        return output
    }
    _freqToSpeed() {
        //V = ((2 * PI * r ) / 60) * (f / Res * 60) = 7.2 * PI * r * f / Res [km/h]
        this.velocity.speed = (7.2 * Math.PI * config.WHEELS_RADIUS * this.hardware.step.getPwmFrequency()
            / (config.HARDWARE_PUL_PER_REV)).toFixed(2)
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
        this.highestFreq = 0
        this._getReady()
    }
    goForward(autoMode) {
        const cmd = 'forward'
        if (autoMode !== true)
            this.history.push(this.leftFrontAxis.drive(cmd))
        else
            this.leftFrontAxis.drive(cmd)
        this.leftRearAxis.drive(cmd)
        this.rightFrontAxis.drive(cmd)
        this.rightRearAxis.drive(cmd)
    }
    turnLeft(autoMode) {
        const cmd = 'turnLeft'
        if (autoMode !== true)
            this.history.push(this.leftFrontAxis.drive(cmd))
        else
            this.leftFrontAxis.drive(cmd)
        this.leftRearAxis.drive(cmd)
        this.rightFrontAxis.drive(cmd)
        this.rightRearAxis.drive(cmd)
    }
    turnRight(autoMode) {
        const cmd = 'turnRight'
        if (autoMode !== true)
            this.history.push(this.leftFrontAxis.drive(cmd))
        else
            this.leftFrontAxis.drive(cmd)
        this.leftRearAxis.drive(cmd)
        this.rightFrontAxis.drive(cmd)
        this.rightRearAxis.drive(cmd)
    }
    goLeft(autoMode) {
        const cmd = 'goLeft'
        if (autoMode !== true)
            this.history.push(this.leftFrontAxis.drive(cmd))
        else
            this.leftFrontAxis.drive(cmd)
        this.leftRearAxis.drive(cmd)
        this.rightFrontAxis.drive(cmd)
        this.rightRearAxis.drive(cmd)
    }
    goRight(autoMode) {
        const cmd = 'goRight'
        if (autoMode !== true)
            this.history.push(this.leftFrontAxis.drive(cmd))
        else
            this.leftFrontAxis.drive(cmd)
        this.leftRearAxis.drive(cmd)
        this.rightFrontAxis.drive(cmd)
        this.rightRearAxis.drive(cmd)
    }
    goBackward(autoMode) {
        const cmd = 'backward'
        if (autoMode !== true)
            this.history.push(this.leftFrontAxis.drive(cmd))
        else
            this.leftFrontAxis.drive(cmd)
        this.leftRearAxis.drive(cmd)
        this.rightFrontAxis.drive(cmd)
        this.rightRearAxis.drive(cmd)
    }
    reverseLeft(autoMode) {
        const cmd = 'reverseLeft'
        if (autoMode !== true)
            this.history.push(this.leftFrontAxis.drive(cmd))
        else
            this.leftFrontAxis.drive(cmd)
        this.leftRearAxis.drive(cmd)
        this.rightFrontAxis.drive(cmd)
        this.rightRearAxis.drive(cmd)
    }
    reverseRight(autoMode) {
        const cmd = 'reverseRight'
        if (autoMode !== true)
            this.history.push(this.leftFrontAxis.drive(cmd))
        else
            this.leftFrontAxis.drive(cmd)
        this.leftRearAxis.drive(cmd)
        this.rightFrontAxis.drive(cmd)
        this.rightRearAxis.drive(cmd)
    }
    stop(autoMode) {
        if (autoMode !== true)
            this.history.push(this.leftFrontAxis.drive())
        else
            this.leftFrontAxis.drive()
        this.leftRearAxis.drive()
        this.rightFrontAxis.drive()
        this.rightRearAxis.drive()
    }
    async pathHasBeenSaved() {
        this.history = []
        this._message(`Path has been saved.`)
    }
}
const controller = new Controller('Controller')

module.exports = controller