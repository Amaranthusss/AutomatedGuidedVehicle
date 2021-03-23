const raspGpio = require('pigpio').Gpio
const pinout = require('.../config/pinout').axises
const arduino = require('.../arduino').arduino
const diag = require('.../diag/diagNew')
const Encoder = require('../backup/encoder')

class Axis {
    constructor(name, pinout) {
        this.name = name
        this.id = Axis.ids++
        this.hardware = {
            pinout: Object.assign({}, pinout),
            en = new raspGpio(pinout.motor.EN, { mode: raspGpio.OUTPUT }),
            dir = new raspGpio(pinout.motor.DIR, { mode: raspGpio.OUTPUT }),
            step = new raspGpio(pinout.motor.STEP, { mode: raspGpio.OUTPUT, pullUpDown: raspGpio.PUD_UP }),
            a = arduino.pinMode(pinout.encoder.A, 0),
            b = arduino.pinMode(pinout.encoder.B, 0)
        }
        this.encoder = new Encoder(this)
        diag.hello(this)
    }
    
}


en.digitalWrite(0)
dir.digitalWrite(0)
let freq = 700 //8k max
let pwm = 250
let dirB = false
step.pwmWrite(pwm)
step.pwmFrequency(freq)
setInterval(() => {
    if (dirB == false)
        freq = freq + 100
    else
        freq = freq - 100
    if (freq > 2500) {
        dirB = true
        freq = 2400
    } else if (freq < 500) {
        dirB = false
        freq = 600
    }

    step.pwmFrequency(freq)
    console.log(pwm, step.getPwmFrequency(), freq)
}, 1000)

Axis.ids = 1
axisLeftFront = new Axis(pinout.leftFront)