
const port = require('../config/config').SERVER.ASYNC_PORT
const { createServer } = require('wss')
const wss = createServer(function connectionListener(ws) {
  wss = ws
  ws.send('welcome!')
  ws.on('message', (data) => {
    ws.send(data.toString()) // echo-server
  })
})
  .listen(port, function () {
    const { address, port } = this.address() // this is the http[s].Server
    console.log('listening on http://%s:%d (%s)', /::/.test(address) ? '0.0.0.0' : address, port)
  })

// wsServer.on('connection', function connection(ws) {
//   console.log('[WebSocket]', 'Server has been established')
//   // ws.on('message', function incoming(message) {
//   //   let packet = JSON.parse(message)
//   //   if (packet.cmd === 'forward')
//   //     console.log(packet.data)
//   // })
// })
module.exports = wss