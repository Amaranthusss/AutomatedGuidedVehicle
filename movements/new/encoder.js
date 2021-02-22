const config = require('.../config/config')


module.exports = class Encoder {
    constructor(axis) {
        this.lastState = axis.hardware.a.read(
            (error, value) => {
                try {
                    return value
                } catch (error) {
                    diag.message(axis, `Read at pin ${pinout.encoder.A} failed [constructor]`)
                }
            }
        )
        this.counter = 0
        this.state
        this._start()
    }
    _start() {
        while (true) {
            this.state = axis.hardware.a.read(
                (error, value) => {
                    try {
                        return value
                    } catch (error) {
                        diag.message(axis, `Read at pin ${pinout.encoder.A} failed [interval]`)
                    }
                }
            )
            if (this.state != this.lastState) {
                if (axis.hardware.b.read(
                    (error, value) => {
                        try {
                            return value
                        } catch (error) {
                            diag.message(axis, `Read at pin ${pinout.encoder.B} failed [interval]`)
                        }
                    }
                ) != this.state) {
                    this.counter++
                } else
                    this.counter--
            }
            this.lastState = this.state
        }
    }
}