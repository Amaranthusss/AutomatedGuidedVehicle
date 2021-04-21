
const WebSocket = require('wss')
const port = require('../config/config').SERVER.ASYNC_PORT
const wss = WebSocket.createServer()
const httpsCreateServer = require('https').createServer
const https = httpsCreateServer()
https.listen(port)

/*
wss.on('connection', function connection(ws) {
  console.log('[WebSocket]', 'Server has been established')
  ws.on('message', function incoming(message) {
    let packet = JSON.parse(message)
    if (packet.cmd === 'forward')
      console.log(packet.data)
  })
})*/
module.exports = wss