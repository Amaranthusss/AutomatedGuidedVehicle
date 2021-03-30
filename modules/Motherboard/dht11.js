const arduino = require('../Arduino').arduino

class readSensor {
    constructor(pinout) {
        this.hardware = {
            pinout: pinout,
            pin: arduino.pinMode(pinout.data, 1)
        }
        this.temperature = 0
        this.humidity = 0
        this.startTime = null
        this.lastReadTime = null
        this.output = { debRes0: null, debRes1: null, data: [] }
    }
    _measure() {
        function _program() {
            await _wakeUp()
            await _wait()
        } _program()
        async function _wakeUp() {
            await arduino.pinMode(pinout.data, 1)
            await this.hardware.pin.digitalWrite(pinout.data, 0)
            await new Promise(s => setTimeout(s, 18 / 1000))
        }
        async function _wait() {
            this.hardware.pin.digitalWrite(pinout.data, 1)
            await new Promise(s => setTimeout(s, 20 / 1000)) //20um means minimum, max is 40um
            await arduino.pinMode(pinout.data, 0)
            let lastMem = 1
            let interval = setInterval(() => { //try to find negative edge
                let currentMem = this.hardware.pin.digitalRead(pinout.data)
                if (lastMem != currentMem) {
                    await _debRes0()
                    clearInterval(interval)
                }
            }, 2 / 1000)
        }
        async function _debRes0() { //at start this is 0
            await new Promise(s => setTimeout(s, 70 / 1000))
            this.output.debRes0 = this.hardware.pin.digitalRead(pinout.data) //shound be 0
            await new Promise(s => setTimeout(s, 10 / 1000)) //end of 80um frame
            await _debRes1()
        }
        async function _debRes1() { //at start this is 1
            await new Promise(s => setTimeout(s, 70 / 1000))
            this.output.debRes1 = this.hardware.pin.digitalRead(pinout.data) //should be 1
            await new Promise(s => setTimeout(s, 10 / 1000)) //end of 80um frame
            await _read()
        }
        async function _read() {
            if (this.output.data.length <= 40) {
                //starts 50um preparation for bit at low level
                await new Promise(s => setTimeout(s, (50 + 28) / 1000)) //moment for bit 0
                let det = await this.hardware.pin.digitalRead(pinout.data)
                if (det === 0) //BIT 0
                {
                    this.output.data.push(det)
                    await _read()
                } else {
                    await new Promise(s => setTimeout(s, (70 - 28) / 1000)) //moment of bit 1
                    det = this.hardware.pin.digitalRead(pinout.data)
                    if (det === 1) this.output.data.push(det) //BIT 1
                }
            } else return

        }
    }


}