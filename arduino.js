//************Arduino Board & Port Configuration************
var five = require('johnny-five');
board = new five.Board({ port: "/dev/ttyACM0" });

//************Objects' List************


board.on("ready", function () {
    console.log("[ARDUNIO] Here we go!");
    scanners = require('./scanner')
    setTimeout(() => { console.log(scanners.rearScanner.output) }, 5000);
});

module.exports = board;