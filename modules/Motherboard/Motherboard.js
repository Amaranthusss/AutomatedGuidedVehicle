const { Module } = require('../Module')
const pinout = require('../../config/pinout').motherboard
const { VOLTAGE_SENSOR, CURRENT_SENSOR } = require('../../config/config').MOTHERBOARD
const { Led, Sensor, Multi, Pin } = require('johnny-five')
const arduino = require('../Arduino').arduino
var dht = require("node-dht-sensor")



class Motherboard extends Module {
    constructor(...params) {
        super(...params)
        this.hardware = {
            ...this.hardware,
            leftGreen: new Led(pinout.rj45Left.green),
            leftYellow: new Led(pinout.rj45Left.yellow),
            rightGreen: new Led(pinout.rj45Right.green),
            rightYellow: new Led(pinout.rj45Right.yellow),
            alarm: new Led(pinout.errorDiode.state),
            cooler: arduino.pinMode(pinout.cooler.pwm, Pin.PWM),
            voltageSensor: new Sensor(pinout.voltageSensor.read),
            currentSensor: new Sensor({ pin: pinout.currentSensor.read }),
            //dht: new Multi({ controller: "DHT11_I2C_NANO_BACKPACK" })
        }
        /*this.hardware.dht.on("change", function () {
            console.log("celsius: ", this.thermometer.celsius,
                "relative humidity: ", this.hygrometer.relativeHumidity)
        })*/
        this.voltage = 0
        this.current = 0
        this.humidity = 0
        this.temperature = 0
        this.alarmDiodeStates = { lowVoltage: false }
        this.coolerStates = { raspiFan: false }
        this.diagVoltageInterval = setInterval(() => { this.getVoltage() }, 60000)
        this.hardware.voltageSensor.on("change", () => {
            this.voltage = ((this.hardware.voltageSensor.value * VOLTAGE_SENSOR.ARDUNIO_REFERENCE / 1024)
                / (VOLTAGE_SENSOR.LOWER_RESISTANCE / VOLTAGE_SENSOR.HIGHER_RESISTANCE)).toFixed(2)
        })
        this.hardware.currentSensor.on("change", () => {
            this.current = ((this.hardware.currentSensor.value * 5 / 1023 - 2.5) / 0.066).toFixed(4)
            //this.current = this.hardware.currentSensor.fscaleTo(0, 30)
        })
        /*
        {
            let five = require("johnny-five")
            let scale = five.Fn.scale
            let VCC = 4425;
            function toMV(value) {
                return scale(value, 0, 1023, 0, VCC) | 0
            }
            function render(mA) {
                // mA means milli-amps
                let mAF = mA
                mA = Number(mAF);
                // Limit bar rendering to values that are unique from the
                // previous reading. This prevents an overwhelming number
                // of duplicate bars from being displayed.
                if (render.last !== mA) {
                    //console.log((mAF * 1000).toFixed(2) + 'A')
                }
                render.last = mA;
            }
            let samples = 100;
            let accumulator = 0;
            let count = 0;
            let amps = 0;
            let qV = 0;
            this.hardware.currentSensor.on('data', function () {
                let adc = 0;
                let currentAmps = 0;
                let aF = (VCC / 100) / 1023;
                if (!qV) {
                    if (!count) {
                        //console.log("Calibrating...");
                    }
                    if (count < (samples * 40)) {
                        count++;
                        accumulator += this.value;
                    } else {
                        qV = Math.max(512, (accumulator / (samples * 40)) | 0);
                        accumulator = count = 0;
                        //console.log("qV: %d (%d) ", toMV(qV), qV);
                    }
                } else {
                    if (count < samples) {
                        count++;
                        adc = this.value - qV;
                        accumulator += adc * adc;
                    } else {
                        // 3. Update the running root mean square value        
                        currentAmps = Math.sqrt(accumulator / samples) * aF;
                        accumulator = count = 0;

                        // ACS is fairly innaccurate below 0.03
                        if (currentAmps < 0.03) {
                            currentAmps = 0;
                        }
                    }
                    amps = currentAmps ?
                        (amps ? (currentAmps + amps) / 2 : currentAmps) :
                        amps;
                    if (qV && amps) {
                        render(amps);
                    }
                }
            })
        }*/

        this._getReady()
    }
    getVoltage() {
        this.alarmDiodeStates.lowVoltage = this.voltage <= VOLTAGE_SENSOR.LOW_VOLTAGE_LEVEL ? true : false
        let errorText = ''
        if (this.alarmDiodeStates.lowVoltage === true)
            errorText = `ERROR: Voltage lower than ${VOLTAGE_SENSOR.LOW_VOLTAGE_LEVEL}V! `
        this._message(`${errorText}Voltage: ${this.voltage}V`)
        this._alarmDiode()
        this.getCurrent()
        return this.voltage
    }
    _alarmDiode() {
        let error = Object.entries(this.alarmDiodeStates).find(el => el[1] == true)
        if (error) this.hardware.alarm.blink()
        else this.hardware.alarm.off()
        return this.alarmDiodeStates
    }
    getCurrent() {
        this._message(`Current: ${this.current}A`)
        return this.current
    }
    setCooler(name, lvl) {
        this.coolerStates[name] = lvl
        this._cooling()
    }
    _cooling() {
        let cooling = Object.entries(this.coolerStates).find(el => el[1] == true)
        if (cooling) this.hardware.cooler.analogWrite(pinout.cooler.pwm, 255)
        else this.hardware.cooler.analogWrite(pinout.cooler.pwm, 0)
    }
}

motherboard = new Motherboard('Motherboard', pinout)
module.exports = { motherboard: motherboard }