//Immediately-invoked Function Expression
(() => {
    require('events').EventEmitter.defaultMaxListeners = 10000;
})()

const arduino = require('./arduino')
const server = require('./com/server')
const bodyDiag = require('./diag/bodyDiag')
bodyDiag.hello({
    name: 'main function',
    id: '0',
    output: [0],
    hardware: { pinout: [0] }
})

setTimeout(() => {
    server.io.sockets.on('connection', function (socket) {
        if (arduino.status = 'ready') {
            setInterval(() => {
                const rearScanner = require('./scanners/scanners').rearScanner
                function commitScanner(scanner) {
                    if (scanner.commitFlag == true) {
                        socket.emit("PROXIMITY_" + JSON.stringify(scanner.output[scanner.output.length - 1]))
                        scanner.commitFlag = false
                    }
                }
                commitScanner(rearScanner)
            }, 1)
        }

    })
}, 2000)



