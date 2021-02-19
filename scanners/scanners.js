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
        this.interval = null
        this.kMeans = new KMeans()
        this.motor = new Motor(this.hardware.pinout)
        this._initialization()
        this.angle = {
            value: -config.MAX_ANGLE - 1,
            ini: false
        }
        this.output = []
    }
    async _initialization() {
        this._hello() //Inform terminal about initialization
        this.hardware.trig.digitalWrite(0) //Prepare trigger pin
        this.motor.home() //Get lowest possible angle at motor
    }
    start() { 
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
    stop() { clearInterval(this.interval) }
    _hello() { console.log(this._getName(), this.hardware.pinout) }
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
        if (await this.motor.getDir() == false && this.angle.value != config.MAX_ANGLE)
            this.angle.value++
        else
            this.angle.value--
        if (this.angle.ini == true)
            if (this.angle.value >= config.MAX_ANGLE || this.angle.value <= -config.MAX_ANGLE)
                this.motor.changeDir()
        this.angle.ini = true
    }
    async _getSingle() { this.hardware.trig.trigger(config.TRIG_TIME, 1) }
    async _clearData() {
        this.current.data = []
        this.current.highest = 0
        this.current.lowest = config.SENSOR_MAX_RANGE
    }
    _getName() { return '[' + this.name + ':' + this.id + ']' }
    /** Sets min, max & average values; Starts K-Means algorithm for current data; Sets output distance data; Clear data buffer */
    async _isolate() {
        await this._analzye()
        await this.kMeans.start(this.current)
        console.log({dist: Math.round(this.kMeans.body.dist), angle: this.angle.value})
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
//frontScanner = new Scanner('Front', pinout.ultraSonicSensorFront)




module.exports = {
    rearScanner: rearScanner,
    //frontScanner: frontScanner
}