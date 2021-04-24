//___________ Immediately-invoked Function Expression ___________
(() => require('events').EventEmitter.defaultMaxListeners = 10000)()
//___________ Linkers ___________
const asyncServer = require('./server/websocket')
//___________ Configuration ___________
const config = require('./config/config')
//___________ Modules ___________
const arduino = require('./modules/Arduino')
//___________ Communication ___________
// if (arduino.status = 'ready') {
//     asyncServer.on('connection', function connection(con) {
//         setTimeout(() => {
//             setInterval(() => {
//                 rearScanner.commitData(con)
//                 frontScanner.commitData(con)
//             }, 1)
//         }, config.SCANNERS.DELAY_TO_START)
//     })
// }