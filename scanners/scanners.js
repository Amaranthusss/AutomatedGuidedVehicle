const pinout = require('../config/pinout')
const Gpio = require('pigpio').Gpio
const KMeans = require('./kmeans')
const Motor = require('./motor')
const config = require('../config/config').SCANNERS

class Scanner {
    constructor(name, pinout) {
        this.hardware = {
            pinout: Object.assign({}, pinout),
            trig: new Gpio(pinout.TRIG, { mode: Gpio.OUTPUT }),
            echo: new Gpio(pinout.ECHO, { mode: Gpio.INPUT, alert: true })
        }
        this.name = name
        this.id = Scanner.ids++
        this.current = {
            data: [],
            lowest: config.SENSOR_MAX_RANGE,
            highest: 0,
            angle: 0,
            average: null
        }
        this._initialization()
        this.kMeans = new KMeans()
        this.motor = new Motor(this.hardware.pinout)
        this.angle = 0
        this.output = []
    }
    _initialization() {
        this._hello()
        this.hardware.trig.digitalWrite(0)
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
    _hello() { console.log('[', this.name, ':', this.id, ']', this.hardware.pinout) }
    async _append(value) {
        if (value > 5 && value <= config.SENSOR_MAX_RANGE)
            this.current.data.push(value)
        if (this.current.data.length >= config.PACKAGE_SIZE)
            this._isolate()
    }
    async _analzye() {
        this.current.highest = Math.max(...this.current.data)
        this.current.lowest = Math.min(...this.current.data)
        this.current.average = Math.round(this.current.data.reduce((a, b) => a + b, 0) / this.current.data.length)
        if (this.angle >= 0 && this.angle < config.MAX_ANGLE)
            this.angle++
        else if (this.angle >= -config.MAX_ANGLE && this.angle < 0)
            this.angle--
        if (this.angle == (config.MAX_ANGLE - 1) || this.angle == -config.MAX_ANGLE)
            this.motor.changeDir()
    }
    async _getSingle() { this.hardware.trig.trigger(10, 1) }
    async _clearData() {
        this.current.data = []
        this.current.highest = 0
        this.current.lowest = config.SENSOR_MAX_RANGE
    }
    /** Sets min, max & average values; Starts K-Means algorithm for current data; Sets output distance data; Clear data buffer */
    async _isolate() {
        await this._analzye()
        await this.kMeans.start(this.current)
        console.log(Math.round(this.kMeans.body.dist), this.angle)
        this.output.push(Math.round(this.kMeans.body.dist))
        await this.motor.rotateScanner()
        //await this.printDebbug()
        await this._clearData()
    }
    async printDebbug() { console.log('\n[', this.name, ':', this.id, ']\n', this.current, '\n', await this.kMeans.return()) }
    printf() { console.log('[', this.name, ':', this.id, ']', this.output) }

}

Scanner.ids = 1
rearScanner = new Scanner('Rear', pinout.ultraSonicSensorRear)
frontScanner = new Scanner('Front', pinout.ultraSonicSensorFront)
setInterval(() => {
    rearScanner._getSingle()
    //frontScanner._getSingle()
}, config.TRIG_PAUSE);

module.exports = {
    rearScanner: rearScanner,
    frontScanner: frontScanner
}