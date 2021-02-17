const Pinout = require("./pinout")
const Gpio = require('pigpio').Gpio
const KMeans = require('./kmeans')

const MICROSECDONDS_PER_CM = 1e6 / 34321
const SENSOR_MAX_RANGE = 300
const TRIG_PAUSE = 10
const PACKAGE_SIZE = 30

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
            lowest: SENSOR_MAX_RANGE,
            highest: 0,
            angle: 0,
            average: null
        }
        this._initialization()
        this.kMeans = new KMeans()
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
                this._append(Math.round(diff / 2 / MICROSECDONDS_PER_CM))
            }
        });
    }
    _hello() { console.log('[', this.name, ':', this.id, ']', this.hardware.pinout) }
    async _append(value) {
        if (value > 5 && value <= SENSOR_MAX_RANGE)
            this.current.data.push(value)
        if (this.current.data.length >= PACKAGE_SIZE)
            this._isolate()
    }
    async _analzye() {
        this.current.highest = Math.max(...this.current.data)
        this.current.lowest = Math.min(...this.current.data)
        this.current.average = Math.round(this.current.data.reduce((a, b) => a + b, 0) / this.current.data.length)
    }
    async _getSingle() { this.hardware.trig.trigger(10, 1) }
    async _clearData() {
        this.current.data = []
        this.current.highest = 0
        this.current.lowest = SENSOR_MAX_RANGE
    }
    async _isolate() {
        await this._analzye()
        await this.kMeans.start(this.current)
        this.output.push(Math.round(this.kMeans.body.dist))
        //await this.printDebbug()
        await this._clearData()
    }
    async printDebbug() { console.log('\n[', this.name, ':', this.id, ']\n', this.current, '\n', await this.kMeans.return()) }
    printf() { console.log('[', this.name, ':', this.id, ']', this.output) }

}

Scanner.ids = 1
rearScanner = new Scanner('Rear', Pinout.ultraSonicSensorRear)
frontScanner = new Scanner('Front', Pinout.ultraSonicSensorFront)
setInterval(() => { 
    rearScanner._getSingle()
    //frontScanner._getSingle()
}, TRIG_PAUSE);

module.exports = {
    rearScanner: rearScanner,
    frontScanner: frontScanner
}