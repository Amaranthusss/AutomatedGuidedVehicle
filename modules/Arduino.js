//************Arduino Board & Port Configuration************
var { Board } = require('johnny-five')
board = new Board({ port: "/dev/ttyAMA0" })
var arStatus = 'closed'

//************Objects' List************
board.on("ready", function () {
    arStatus = 'ready'
    console.log("[ARDUNIO] Here we go!")

    //___________ Modules ___________
    const syncServer = require('../server/server')
    const raspberryPi = require('./RaspberryPi/RaspberryPi')
    const motherboard = require('./Motherboard/Motherboard')
    const rearScanner = require('./Scanners/Scanners').rearScanner
    const frontScanner = require('./Scanners/Scanners').frontScanner
    const brakeLight = require('./BrakeLight/BrakeLight')
    //const leftLight = require('./Lighting/Lighting').leftLight
    //const middleLight = require('./Lighting/Lighting').middleLight
    //const rightStrip = require('./Lighting/Lighting').rightStrip
    const controller = require('./Axises/Axises')


})
board.on("exit", () => {
    arStatus = 'exit'
    for (let i = 0; i < 50; i++)
        board.digitalWrite(i, 0)

})
/*
board.on("message", function (event) {
    console.log("Received a %s message, from %s, reporting: %s", event.type, event.class, event.message)
})
board.on("fail", function (event) {
    console.log("%s sent a 'fail' message: %s", event.class, event.message)
})
board.on("warn", function (event) {
    console.log("%s sent a 'warn' message: %s", event.class, event.message)
})
board.on("info", function (event) {
    console.log("%s sent an 'info' message: %s", event.class, event.message)
})*/

module.exports = {
    arduino: board,
    status: arStatus
}