const internal = {};

//************Arduino Board & Port Configuration************
var five = require('johnny-five');
board = new five.Board({ port: "/dev/ttyACM0" });

module.exports = board;