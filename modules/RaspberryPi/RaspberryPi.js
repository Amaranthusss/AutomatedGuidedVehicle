var pi = require('node-raspi')
const { Module } = require('../Module')
const { Pin } = require('johnny-five')
const pinout = require('../../config/pinout').coolerRaspPi
const config = require('../../config/config').RASPBERRYPI
const arduino = require('../Arduino').arduino
const { motherboard } = require('../Motherboard/Motherboard')
const { inRange } = require('../../global/math')
const fs = require('fs')

class RaspberryPi extends Module {
    constructor(...params) {
        super(...params)
        this.hardware = {
            ...this.hardware,
            cooler: arduino.pinMode(pinout.pwm, Pin.PWM)
        }
        this.temp = 0 //pi.getThrm()
        this.voltage = 4.4 //pi.getVcc() / 1000
        this.cooling = false
        this.coolerState = 'NaN'
        this.coolerPWM = 0
        // this.refreshDataInterval = setInterval(() => this._refreshData(), config.CHECK_TEMPERATURE_INTERVAL)
        this._getReady()
        //this._message(`Initial CPU temperature: ${this.temp}°C, CPU voltage: ${this.voltage}V via node-raspi.`)
    }
    _refreshData() {
        this.temp = fs.readFileSync('/sys/class/thermal/thermal_zone0/temp') / 1000
        if (this.temp <= config.COOLER_TEMP_STOP && this.cooling === true)
            this.cooling = false
        if (this.temp >= config.COOLER_TEMP_START && this.cooling === false)
            this.cooling = true
        if (this.cooling) {
            motherboard.setCooler('raspiFan', true)
            if (this.temp >= config.COOLER_TEMP_START && this.temp <= config.COOLER_TEMP_START + 4) {
                this.coolerState = 'warm'
                this.coolerPWM = config.PWM_BOOST_AT_HOT * Math.round(this.temp)
            }
            else if (this.temp > config.COOLER_TEMP_START + 4) {
                this.coolerState = 'overheating'
                this.coolerPWM = config.PWM_BOOST_AT_OVERHEATING * Math.round(this.temp)
            }
            else {
                this.coolerState = 'warm'
                this.coolerPWM = config.PWM_BOOST_AT_WARM * Math.round(this.temp)
            }
            this.hardware.cooler.analogWrite(
                pinout.pwm,
                inRange(this.coolerPWM, { max: 255, min: 160, limit: true })
            )
        } else {
            motherboard.setCooler('raspiFan', false)
            this.coolerState = 'cool'
            this.coolerPWM = 0
            this.hardware.cooler.analogWrite(pinout.pwm, 0)
        }
        //this.coolerInfo()

    }
    coolerInfo() {
        this._message(`CPU temperature: ${this.temp}°C from the [temp] file. PWM: ${this.coolerPWM}, state: ${this.coolerState}`)
    }
}
raspberryPi = new RaspberryPi('Raspberry Pi', pinout)

module.exports = { raspberryPi: raspberryPi }