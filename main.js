//___________ Immediately-invoked Function Expression ___________
(() => {
    require('events').EventEmitter.defaultMaxListeners = 10000;
})()
//___________ Libraries ___________
const fetch = require('node-fetch');
//___________ Modules ___________
const arduino = require('./arduino')
const server = require('./com/server')
//___________ Communication ___________
var ScannerController = require('./com/controllers/ScannerController')
setTimeout(() => {
    //server.io.sockets.on('connection', function (socket) {
    if (arduino.status = 'ready') {
        setInterval(() => {
            const rearScanner = require('./scanners/scanners').rearScanner
            function commitScanner(scanner) {
                if (scanner.commitFlag == true) {
                    ScannerController.data.name = scanner.name
                    ScannerController.data.output = scanner.output[scanner.output.length - 1]
                    scanner.commitFlag = false
                }
            }
            commitScanner(rearScanner)
        }, 1)
    }

    //})
}, 10000)

//setInterval(() => { console.log('data', scannerCtrl.data) }, 1000)