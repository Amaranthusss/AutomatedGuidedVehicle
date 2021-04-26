//to delete: this is only to fix problem with do not work motors
const arduino = require('../Arduino').arduino
const config = require('../../config/config').SCANNERS
const pinout = require('../../config/pinout').scanners
const { Pin } = require('johnny-five')

class Motor {
    constructor(pinout) {
        this.pins = {
            A: new Pin(pinout.a),
            B: new Pin(pinout.b),
            C: new Pin(pinout.c),
            D: new Pin(pinout.d),
        }
        this.step_number = 0
        this.pins.A.low()
        this.pins.B.low()
        this.pins.C.low()
        this.pins.D.low()
        setInterval(() => { this._step() }, 2000);
    }
    _step() {
        switch (this.step_number) {
            case 0:
                this.pins.A.high()
                this.pins.B.low()
                this.pins.C.low()
                this.pins.D.low()
                break;
            case 1:
                this.pins.A.low()
                this.pins.B.high()
                this.pins.C.low()
                this.pins.D.low()
                break;
            case 2:
                this.pins.A.low()
                this.pins.B.low()
                this.pins.C.high()
                this.pins.D.low()
                break;
            case 3:
                this.pins.A.low()
                this.pins.B.low()
                this.pins.C.low()
                this.pins.D.high()
                break;
        }
        console.log('step', this.step_number)
        this.step_number++;
        if (this.step_number > 3)
            this.step_number = 0;
    }
}

frontMotor = new Motor(pinout.scannerFront)
rearMotor = new Motor(pinout.scannerRear)

module.exports = { frontMotor, rearMotor }