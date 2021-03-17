//___________ Immediately-invoked Function Expression ___________
(() => {
    require('events').EventEmitter.defaultMaxListeners = 10000;
})()
//___________ Modules ___________
const arduino = require('./arduino')
const server = require('./server/server')
const axises = require('./config/pinout').axises
//___________ Async Server ___________
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8081 })
//___________ Communication ___________
wss.on('connection', function connection(ws) {
    setTimeout(() => {
        if (arduino.status = 'ready') {
            setInterval(() => {
                const rearScanner = require('./scanners/scanners').rearScanner
                function commitScanner(scanner) {
                    if (scanner.commitFlag == true) {
                        let scannerData = {
                            name: scanner.name,
                            output: scanner.output[scanner.output.length - 1]
                        }
                        ws.send(JSON.stringify(scannerData))
                        scanner.commitFlag = false
                    }
                }
                commitScanner(rearScanner)
            }, 1)
        }
    }, 10000)
})
//setInterval(() => { console.log('data', scannerCtrl.data) }, 1000)

const raspGpio = require('pigpio').Gpio
const en = new raspGpio(axises.leftFront.motor.EN, { mode: raspGpio.OUTPUT })
const dir = new raspGpio(axises.leftFront.motor.DIR, { mode: raspGpio.OUTPUT })
const step = new raspGpio(axises.leftFront.motor.STEP, { mode: raspGpio.OUTPUT, pullUpDown: raspGpio.PUD_UP })

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
//console.log(step.getPwmFrequency())