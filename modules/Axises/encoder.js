const config = require('../../config/config').AXISES
class Encoder {
    constructor(axis, upButton, downButton) {
        this.axis = axis
        this.upButton = upButton
        this.downButton = downButton
        this.c = 0
        this.timeAtPrevPos = Date.now()
        this.timeAtZero = this.timeAtPrevPos
        this.velocity = 0.0
        this.prevDir = false

        this.upButton.on('up', () => { this._measureSpeed(true) })
        this.downButton.on('up', () => { this._measureSpeed(false) })
    }
    _measureSpeed(dir) {
        let currentTime = Date.now()
        this.axis._message(`At time ${currentTime} counter is equal ${this.c}.`)
        if (currentTime - this.timeAtPrevPos > config.IMPULSES_PROTECT_TIME) { //Eliminate error impulses
            switch (dir) {
                case true: this.c++; break; //Increase a counter's value
                default: this.c--; break; //Decrease a counter's value
            }
            if (dir !== this.prevDir) { //Found new zero point - direction has been changed
                this.timeAtZero = currentTime
                this.c = 0
            }
            this.prevDir = dir
            if (this.c >= config.ENCODER_IMPULSES_PER_ROTATION
                || this.c <= -config.ENCODER_IMPULSES_PER_ROTATION) { //Achived full rotate
                this.c = 0
                //v = 3/25 Pi * R * 60/t [km/h]
                this.velocity = Math.PI() * config.WHEELS_RADIUS * 7200 / (currentTime - this.timeAtZero)
                console.log(axis._message(`Current velocity is equal ${this.velocity} km/h at direction ${this.dir}.`))
            }
        }
        this.timeAtPrevPos = currentTime

    }
}
module.exports = Encoder

//Possible to use Gray-Code system to fix problem with failed impulse at modes changes