//___________ Immediately-invoked Function Expression ___________
(() => {
    require('events').EventEmitter.defaultMaxListeners = 10000;
})()
//___________ Modules ___________
const arduino = require('./arduino')
const server = require('./server/server')
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