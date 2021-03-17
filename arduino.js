//************Arduino Board & Port Configuration************
var {Board, Led} = require('johnny-five')
board = new Board({ port: "/dev/ttyAMA0" })
const config = require('./config/config')
const pinout = require('./config/pinout')
var arStatus = 'closed'

//************Objects' List************
board.on("ready", function () {
    arStatus = 'ready'
    console.log("[ARDUNIO] Here we go!")
    //const scanners = require('./scanners/scanners')
    //setTimeout(() => { scanners.rearScanner.start(); console.log('Scanner has been started') }, config.SCANNERS.DELAY_TO_START)


    const errorDiode = new Led(pinout.errorDiode.state)
    errorDiode.blink(500)


    board.on("exit", () => {
        arStatus = 'exit'
    });
});

module.exports = {
    arduino: board,
    status: arStatus
};