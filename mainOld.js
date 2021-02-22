//Immediately-invoked Function Expression
(() => {
    require('events').EventEmitter.defaultMaxListeners = 10000;
})()
//
//Pinouts
//var GpioBTTN = require('onoff').Gpio;
//var buttonStartStop = new GpioBTTN(24, 'in', 'rising', {debounceTimeout: 10});


//process.setMaxListeners(10);


//************Linking all files with the Main() function************
/*
//-------Configuration-------
const Configuration = require("./config");
const config = new Configuration();
//-------Learning Mode-------
const Learning = require("./learning");
const learning = new Learning();
//-------Movements-------
const Movements = require("./movements");
const move = new Movements();
//-------JSON Control-------
const JsonCtrl = require("./jsonCtrl");
const jsonCtrl = new JsonCtrl();
//-------Expander I2C-------
//const ExpanderI2C = require("./expanderI2C");
//const expanderI2C = new ExpanderI2C();
*/
const arduino = require('./arduino')
const rearScanner = require('./scanners/scanners').rearScanner

function each125Milisec() {
}
var each125MilisecInterval = setInterval(each125Milisec, 100);


//Human-Machine Interface (server)
var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
http.listen(8080); //nasłuchuj port 8080
function handler(req, res) { //what to do on requests to port 8080
    fs.readFile(__dirname + '/index.html', function (err, data) { //read file index.html in public folder
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' }); //display 404 on error
            return res.end("404 Not Found");
        }
        res.writeHead(200, { 'Content-Type': 'text/html' }); //write HTML
        res.write(data); //write data from rgb.html
        return res.end();
    });
}
process.on('SIGINT', function () { //on ctrl+c
    process.exit(); //exit completely
});


//Realizing AGV movements
//var checkbraking = setInterval(checkBrakingInterval, 9);
/*
var checkDir_Up_Interval,
    checkDir_Down_Interval,
    checkDir_Left_Interval,
    checkDir_Right_Interval,
    checkDir_Time = 10; //Same config time has to be changed in learning.js/activeAutoPath/toDo

function containsObject(obj, list) {
    try {
        for (var i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.log('ERROR: Loading list of data bases failed.',
            'List should be loaded at load of HTML page.\n', error);
    }
}
*/


setTimeout(
    () => {
        //User control
        io.sockets.on('connection', function (socket) {
            function commitScanner(socket, scanner) {
                if (scanner.commitFlag == true) {
                    socket.emit("PROXIMITY_" + scanner.output[scanner.output.length])
                    scanner.commitFlag = false
                }
            }
            commitScanner(socket, rearScanner)

            //var pathName;
            //var pathsList = [];
            //jsonCtrl.readFromFile('agv/paths/pathsList.json');
            //setTimeout(loadPathsList, 100);


            /*
            function each1000Milisec() {
                function run() {
                    //await frontScannerKMeans.start(frontScanner.output);
                    let out = [0,
                        frontScanner.output.lowest,
                        frontScanner.output.highest,
                        frontScanner.output.angle.toFixed(2)
                    ]
                    //out[0] = (await frontScannerKMeans.return()).dist.toFixed(2);
                    out[0] = frontScanner.output.distances[0].toFixed(2);
                    socket.emit("PROXIMITY_" + out);
                } run();
                //socket.emit("VELOCITY_" + move.getCurrentSpeed());
            }
            var each1000MilisecInterval = setInterval(each1000Milisec, 1000);
            */

            /*
                    function loadPathsList() {
                        pathsList = jsonCtrl.getFilesData();
                        socket.emit("PATHNAMESLIST_" + pathsList);
                    }
                    socket.onevent = function (packet) {
                        console.log("[Echo]" + packet.data);
                        var str = String(packet.data);
                        str = str.split("_");
                        if (str[0] == 'PATHNAME') {
                            pathName = str[1];
                        } else if (str[0] == 'HMI') {
                            if (str[1] == 'finishLearningMode') {
                                learning.turnOffLearningMode('agv/paths/' + pathName + '.json');
                                if (containsObject(pathName, pathsList) == false)
                                    pathsList.push(pathName);
                                jsonCtrl.writeToFile('agv/paths/pathsList.json', JSON.stringify(pathsList));
                                console.log("[PathsList]" + pathsList);
                                socket.emit("PATHNAMESLIST_" + pathsList);
                                config.setMode('manual');
                            } else if (str[1] == 'autoMode') {
            
                            } else if (str[1] == 'startLearningMode') {
                                config.setMode('learning');
                            } else if (str[1] == 'resumeAutoPath') {
                                learning.resumeAutoPath('agv/paths/' + str[2] + '.json');
                                config.setMode('auto');
                            } else if (str[1] == 'activePath') {
                                learning.activeAutoPath('agv/paths/' + str[2] + '.json');
                                config.setMode('auto');
                            } else if (str[1] == 'refreshPathNamesList') {
                                socket.emit("PATHNAMESLIST_" + pathsList);
                            }
                        } else if (str[0] == 'CTRL') {
                            if (config.getMode() == 'manual' || config.getMode() == 'learning') {
                                if (str[1] == 'forwardStart') {
            
                                    move.setForwardClicked(true);
                                    //checkDir_Up_Interval = setInterval(checkDirInterval, checkDir_Time);
                                    move.checkDir();
                                    learning.startTimerHMI('up');
                                } else if (str[1] == 'forwardStop') {
                                    move.setForwardClicked(false);
                                    //clearInterval(checkDir_Up_Interval);
                                    move.checkDir();
                                    move.forwardStop();
                                    learning.stopTimerHMI('up');
                                } else if (str[1] == 'backwardStart') {
                                    move.setBackwardClicked(true);
                                    //checkDir_Down_Interval = setInterval(checkDirInterval, checkDir_Time);
                                    move.checkDir();
                                    learning.startTimerHMI('down');
                                } else if (str[1] == 'backwardStop') {
                                    move.setBackwardClicked(false);
                                    //clearInterval(checkDir_Down_Interval);
                                    move.checkDir();
                                    move.forwardStop();
                                    learning.stopTimerHMI('down');
                                } else if (str[1] == 'turnLeftStart') {
                                    move.setLeftClicked(true);
                                    //checkDir_Left_Interval = setInterval(checkDirInterval, checkDir_Time);
                                    move.checkDir();
                                    learning.startTimerHMI('left');
                                } else if (str[1] == 'turnLeftStop') {
                                    move.setLeftClicked(false);
                                    //clearInterval(checkDir_Left_Interval);
                                    move.checkDir();
                                    move.forwardStop();
                                    learning.stopTimerHMI('left');
                                } else if (str[1] == 'turnRightStart') {
                                    move.setRightClicked(true);
                                    //checkDir_Right_Interval = setInterval(checkDirInterval, checkDir_Time);
                                    move.checkDir();
                                    learning.startTimerHMI('right');
                                } else if (str[1] == 'turnRightStop') {
                                    move.setRightClicked(false);
                                    //clearInterval(checkDir_Right_Interval);
                                    move.checkDir();
                                    move.forwardStop();
                                    learning.stopTimerHMI('right');
                                }
                            }
                        }
                    };
                */
        });
    }, 2000)
/*
function checkBrakingInterval() {
    move.checkbrakingFC();

}
function checkDirInterval() {
    move.checkDir();
}
move.initialization();
*/