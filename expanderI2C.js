const internal = {};

//var five = require("johnny-five");
//var Raspi = require("raspi-io").RaspiIO;
//
//var board = new five.Board({
//    io: new Raspi()
//});
//
//
//
////board.on("open", function() {
////        console.log("Port is open!");
////   });
////   
////board.on("read", function(data) {
////        console.log("Received read: ", data);
////    });
////    
////board.on("data", function(data) {
////        console.log("Received data: ", data);
////    });
//
//
//board.on("ready", function () {
//    console.log("Johnny-Five is ready!");
////    var expander = new five.Expander({
////        controller: "MCP23017"
////    });
////
////    var virtual = new five.Board.Virtual({
////        io: expander
////    });
////
////    for (var i = 0; i < 16; i++)
////        expander.pinMode(i, expander.MODES.INPUT);
////
////    expander.digitalRead(7, function (value) { //Reading digital IR sensor 0
////        inExpanderArray[7] = value;
////    });
//
//
//});
//
//
//board.on("close", () => console.log("Closed JohnnyFive!"));
//
//board.on("info", function(event) {
//  console.log("%s sent an 'info' message: %s", event.class, event.message);
//});
//
//board.on("message", function(event) {
//  console.log("Received a %s message, from %s, reporting: %s", event.type, event.class, event.message);
//});


var inExpanderArray = [];

module.exports = internal.JohnnyFive = class {
    constructor() {
    }
    getValue(pin)
    {
        /**
         * Returns value at selected input from Expander I2C
         * 
         * Returns:
         * @param {USInt}   Pin    Range: 0 -> 15.
         */
        return inExpanderArray[pin];
    }
}








//{
//    var MCP23017 = require('node-mcp23017');
//    var mcp = new MCP23017({
//        address: 0x20, //default: 0x20
//        device: '/dev/i2c-1', // '/dev/i2c-1' on model B | '/dev/i2c-0' on model A
//        debug: true //default: false
//    });
////set all GPIOS to be OUTPUTS
//    var pin = 0;
//    var max = 16;
//    var state = false;
//
//    for (var i = 0; i < 16; i++) {
//        if (i != 7) {
//            mcp.pinMode(i, mcp.OUTPUT);
//        }
//        mcp.digitalWrite(i, mcp.LOW);
//    }
//}