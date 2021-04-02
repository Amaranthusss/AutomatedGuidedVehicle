//___________ Libraries ___________
const WebSocket = require('ws');
//___________ Configuration ___________
const port = require('../config/config').SERVER.ASYNC_PORT
const wss = new WebSocket.Server({ port: port })


wss.on('connection', function connection(ws) {
  console.log('[WebSocket]', 'Server has been established')
  ws.on('message', function incoming(message) {
    let packet = JSON.parse(message)
    if (packet.cmd === 'forward')
      console.log(packet.data)
  })
})
module.exports = wss