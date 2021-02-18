const config = require('../config/config').SCANNERS
const arduino = require('../arduino')

module.exports = class Motor {
    constructor(pinout) {
        this.pins = {
            A: arduino.pinMode(pinout.A, 1),
            B: arduino.pinMode(pinout.B, 1),
            C: arduino.pinMode(pinout.C, 1),
            D: arduino.pinMode(pinout.D, 1)
        }
        this.rotate = {
            sr: [0, 0, 0, 0], //Shift register
            i: 0, //Iteration
            dir: false //Rotate direction
        }
        this.repeater = 0
        this.interval = null
        this.pinout = [
            pinout.A,
            pinout.B,
            pinout.C,
            pinout.D
        ]
    }
    async rotateScanner() {
        this.interval = setInterval(
            () => {
                this.rotate.sr.fill(0)
                this.rotate.sr[this.rotate.i] = 1
                if (this.rotate.dir == false) {
                    if (this.rotate.i < 3)
                        this.rotate.i++
                    else
                        this.rotate.i = 0
                }
                else {
                    if (this.rotate.i > 0)
                        this.rotate.i--
                    else
                        this.rotate.i = 3
                }
                for (let i = 0; i < 4; i++)
                    arduino.digitalWrite(this.pinout[i], this.rotate.sr[i])
                this.repeater++
                if (this.repeater >= config.PULSES_PER_ANGLE) {
                    this.repeater = 0
                    clearInterval(this.interval)
                }
            }, config.MOTOR_STEPS_PAUSE)
    }
    async changeDir() {
        this.rotate.dir = this.rotate.dir != true
    }

}