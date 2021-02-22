//************Arduino Board & Port Configuration************
var five = require('johnny-five');
board = new five.Board({ port: "/dev/ttyACM0" });
const config = require('./config/config')
var arStatus = 'closed'

//************Objects' List************
board.on("ready", function () {
    arStatus = 'ready'
    console.log("[ARDUNIO] Here we go!")
    const scanners = require('./scanners/scanners')
    setTimeout(() => { scanners.rearScanner.start(); console.log('Scanner has been started') }, config.SCANNERS.DELAY_TO_START)


    board.on("exit", () => {
        arStatus = 'exit'
    });
});

module.exports = {
    arduino: board,
    status: arStatus
};