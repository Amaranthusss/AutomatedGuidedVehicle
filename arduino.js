//************Arduino Board & Port Configuration************
var five = require('johnny-five');
board = new five.Board({ port: "/dev/ttyACM0" });

//************Objects' List************
board.on("ready", function () {
    console.log("[ARDUNIO] Here we go!");
    scanners = require('./scanners/scanners')
    setTimeout(() => { scanners.rearScanner.start(); console.log('Scanner has been started') }, 31000);
});

module.exports = board;