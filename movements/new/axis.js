const pigpio = require('pigpio').Gpio
const onoff = require('onoff')
const pinout = require('.../config/pinout').axises
const arduino = require('.../arduino').arduino
const diag = require('.../diag/diagNew')
const Encoder = require('./encoder')

class Axis {
    constructor(name, pinout) {
        this.name = name
        this.id = Axis.ids++
        this.hardware = {
            pinout: Object.assign({}, pinout),
            en = new onoff(pinout.motor.EN, 'out'),
            dir = new onoff(pinout.motor.DIR, 'out'),
            step = new pigpio(pinout.motor.STEP, { mode: Gpio.OUTPUT, pullUpDown: Gpio.PUD_UP }),
            a = arduino.pinMode(pinout.encoder.A, 0),
            b = arduino.pinMode(pinout.encoder.B, 0)
        }
        this.encoder = new Encoder(this)
        diag.hello(this)
    }
}



Axis.ids = 1
axisLeftFront = new Axis(pinout.leftFront)