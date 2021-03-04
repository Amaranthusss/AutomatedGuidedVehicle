const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8081 })

/*
wss.on('connection', function connection(ws) {
  console.log('[WebSocket]', 'Server has been established')
  ws.on('message', function incoming(message) {
    console.log('received: %s', message)
  });
})*/
module.exports = wss