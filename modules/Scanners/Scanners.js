const pinout = require('../../config/pinout').scanners
const Gpio = require('pigpio').Gpio
const KMeans = require('./kmeans')
const Motor = require('./motor')
const config = require('../../config/config').SCANNERS
const { Module } = require('../Module')
const { inRange } = require('../../global/math')

class Scanner extends Module {
    constructor(...params) {
        super(...params)
        this.hardware = {
            ...this.hardware,
            trig: new Gpio(this.hardware.pinout.trig, { mode: Gpio.OUTPUT }),
            echo: new Gpio(this.hardware.pinout.echo, { mode: Gpio.INPUT, alert: true })
        }
        this.current = {
            data: [],
            lowest: config.SENSOR_MAX_RANGE,
            highest: 0,
            angle: 0,
            average: null
        }
        this.interval = null
        this.kMeans = new KMeans()
        this.motor = new Motor(this.hardware.pinout)
        this.hardware.trig.digitalWrite(0) //Prepare trigger pin
        this.motor._home() //Get lowest possible angle at motor
        this.angle = {
            value: -config.MAX_ANGLE - 1,
            ini: false
        }
        this.output = []
        this.commitFlag = false
        this._getReady()
        this.start()
    }
    /** Starts measurement based at ultrasonic sensor. */
    start() {
        this._message('Started.')
        this.interval = setInterval(() => { this._getSingle() }, config.TRIG_PAUSE)
        //Turn on sensor's detection
        let startTick
        this.hardware.echo.on('alert', (level, tick) => {
            if (level == 1) {
                startTick = tick
            } else {
                const endTick = tick
                const diff = (endTick >> 0) - (startTick >> 0)
                this._append(Math.round(diff / 2 / config.MICROSECDONDS_PER_CM))
            }
        });
    }
    /** Stops sending ultrasonic sounds from sensor. */
    stop() { clearInterval(this.interval) }
    _append(value) {
        if (value > config.SENSOR_MIN_RANGE && value <= config.SENSOR_MAX_RANGE)
            this.current.data.push(value)
        if (this.current.data.length >= config.PACKAGE_SIZE)
            this._isolate()
    }
    _analyze() {
        this.printDebbug()
        this.current.highest = Math.max(...this.current.data)
        this.current.lowest = Math.min(...this.current.data)
        this.current.average = Math.round(this.current.data.reduce((a, b) => a + b, 0) / this.current.data.length)
        if (this.motor.getDir() == false && this.angle.value != config.MAX_ANGLE)
            this.angle.value++
        else
            this.angle.value--
        if (this.angle.ini === true && inRange(this.angle.value, { min: -config.MAX_ANGLE + 1, max: config.MAX_ANGLE - 1 }) === false)
            this.motor._changeDir()
        this.angle.ini = true
    }
    _getSingle() { this.hardware.trig.trigger(config.TRIG_TIME, 1) }
    _clearData() {
        this.current.data = []
        this.current.highest = 0
        this.current.lowest = config.SENSOR_MAX_RANGE
    }
    async _isolate() {
        try {
            await this._analyze()
            await this.kMeans.start(this.current)
            this.output.push(
                {
                    dist: Math.round(this.kMeans.body.dist),
                    angle: this.angle.value
                }
            )
            await this.motor._rotateScanner()
            //await this.printDebbug()
            await this._clearData()
            this.commitFlag = true
        } catch (error) {
            this._message('_isolate() error: ' + error.message)
        }
    }
    commitData(con) {
        if (this.commitFlag == true) {
            let scannerData = {
                name: this.name,
                output: this.output[this.output.length - 1]
            }
            con.send(JSON.stringify(scannerData))
            this.commitFlag = false
        }
    }
    /** Prints all variables used at scanner class. */
    printDebbug() {
        this._message(
            JSON.stringify(this.output[this.output.length - 1])
            + JSON.stringify({ rotate: this.motor.rotate, repeater: this.motor.repeater })
        )
    }

}

rearScanner = new Scanner('Rear', pinout.scannerRear)
frontScanner = new Scanner('Front', pinout.scannerFront)



module.exports = {
    rearScanner: rearScanner,
    frontScanner: frontScanner
}