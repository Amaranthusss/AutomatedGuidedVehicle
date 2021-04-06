//const IP = '127.0.0.1'
const IP = '192.168.8.115'
const W3CWebSocket = require('websocket').w3cwebsocket
const client = new W3CWebSocket('wss://' + IP + ':8081')
client.onopen = () => {
  console.log('WebSocket Client Connected')
}
module.exports = client