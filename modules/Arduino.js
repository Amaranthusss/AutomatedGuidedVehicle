//************Arduino Board & Port Configuration************
var { Board, Led } = require('johnny-five')
board = new Board({ port: "/dev/ttyAMA0" })
const config = require('../config/config')
const pinout = require('../config/pinout')
var arStatus = 'closed'

//************Objects' List************
board.on("ready", function () {
    arStatus = 'ready'
    console.log("[ARDUNIO] Here we go!")
    //const scanners = require('./scanners/scanners')
    //setTimeout(() => { scanners.rearScanner.start(); console.log('Scanner has been started') }, config.SCANNERS.DELAY_TO_START)

    //___________ Modules ___________
    const motherboard = require('./Motherboard/Motherboard')
    const rearScanner = require('./Scanners/Scanners').rearScanner
    const frontScanner = require('./Scanners/Scanners').frontScanner
    const controller = require('./Axises/Axises')
    const brakeLight = require('./BrakeLight/BrakeLight')
    const leftLight = require('./Lighting/LeftStrip')
    const middleLight = require('./Lighting/MiddleStrip')
    const rightStrip = require('./Lighting/RightStrip')


    board.on("exit", () => {
        arStatus = 'exit'
    });
});

module.exports = {
    arduino: board,
    status: arStatus
};