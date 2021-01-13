//-------Libraries-------
const Gpio = require('pigpio').Gpio; //To control pins of ultrasonic sensors
//var five = require('johnny-five');

const MICROSECDONDS_PER_CM = 1e6 / 34321; //The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
var scannersProxInterval = null;
const rotConfig = {
    rotTime: 2100, //rotation time for left&right sides
    stopTime: 00, //time to get rest
    stepsPerSide: 200, //limit of steps to change direction at motors
    degPerStep: 0.3 //each step of motor takes 3 deg
};

function triggTrigger() { //ToDo: This fcn should be individual for Scanner's class obj
    frontScanner.pinTrig.trigger(10, 1);
}

//-------Arduino Mega-------
const board = require("./arduino");
//-------JSON Control-------
const JsonCtrl = require("./jsonCtrl");
const jsonCtrl = new JsonCtrl();
//ToDo: Save actual position of scanner to file but there still isn't feedback about current scanner's position

class Scanner {
    constructor(name, id, pinA, pinB, pinC, pinD, trigger, echo) {
        //Scanner construct
        this.name = name;
        this.id = id;
        this.output = 
            {
                distances: [],
                lowest: 0,
                highest: 500,
                angle: 0,
                sum: 0
            }
        ;
        //Motor
        this.pinA = pinA;
        this.pinB = pinB;
        this.pinC = pinC;
        this.pinD = pinD;
        this.mtBit = 0;
        this.mtStep = 0;
        this.mtDir = true;
        //Ultrasonic Sensor
        this.pinTrig = new Gpio(trigger, { mode: Gpio.OUTPUT });
        this.pinEcho = new Gpio(echo, { mode: Gpio.INPUT, alert: true });
        //Processing variables
        this.clear = false;
        this.obstacleStatus = true;
        this.currentLowest = 0;
        this.currentHighest = 500;
    }
    //************ Proximity Sensor ************
    getDistPackage() {
        this.pinTrig.digitalWrite(0); // Make sure trigger is low
        this.watchHCSR04();
        scannersProxInterval = setInterval(
            triggTrigger,
            1000); //Time for each trigg

    }
    watchHCSR04() {
        let startTick;
        let i = 0;
        var currentPackage = [];
        this.currentHighest = 0;
        this.currentLowest = 500;
        this.pinEcho.on('alert', (level, tick) => {
            if (level == 1) {
                startTick = tick;
            } else {
                const endTick = tick;
                const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
                let currentValue = Math.floor(diff / 2 / MICROSECDONDS_PER_CM);
                if (currentValue < 250) //Filtr errors, 250 cm is sensor's max range
                {
                    i++;
                    currentPackage[i] = currentValue;
                    if (currentPackage[i] > this.currentHighest)
                        this.currentHighest = currentPackage[i];
                    if (currentPackage[i] < this.currentLowest)
                        this.currentLowest = currentPackage[i];
                    if (i >= 2) //Package has been measured
                    {
                        currentPackage.splice(0, 1);
                        let sum = 0;
                        for (let j = 0; j < currentPackage.length; j++)
                            sum = currentPackage[j] + sum;
                        this.output =
                        {
                            distances: currentPackage,
                            lowest: this.currentLowest,
                            highest: this.currentHighest,
                            angle: this.getAngle(),
                            sum: sum
                        };
                        i = 0;
                        currentPackage = []; //Clear currentPackage array
                        clearInterval(scannersProxInterval);
                    }
                }
            }
        });
    }
    //************ Motor ************
    rotateScanner () {
        if ((this.mtStep >= rotConfig.stepsPerSide && this.mtDir == true) ||
            (this.mtStep <= -rotConfig.stepsPerSide && this.mtDir == false)) {
            this.mtDir = !this.mtDir;
        }
        if (this.mtDir) {
            switch (this.mtBit) {
                case 0:
                    board.digitalWrite(this.pinA, 1);
                    board.digitalWrite(this.pinB, 0);
                    board.digitalWrite(this.pinC, 0);
                    board.digitalWrite(this.pinD, 0);
                    break;
                case 1:
                    board.digitalWrite(this.pinA, 0);
                    board.digitalWrite(this.pinB, 1);
                    board.digitalWrite(this.pinC, 0);
                    board.digitalWrite(this.pinD, 0);
                    break;
                case 2:
                    board.digitalWrite(this.pinA, 0);
                    board.digitalWrite(this.pinB, 0);
                    board.digitalWrite(this.pinC, 1);
                    board.digitalWrite(this.pinD, 0);
                    break;
                case 3:
                    board.digitalWrite(this.pinA, 0);
                    board.digitalWrite(this.pinB, 0);
                    board.digitalWrite(this.pinC, 0);
                    board.digitalWrite(this.pinD, 1);
                    break;
            }
        } else {
            switch (this.mtBit) {
                case 0:
                    board.digitalWrite(this.pinA, 0);
                    board.digitalWrite(this.pinB, 0);
                    board.digitalWrite(this.pinC, 0);
                    board.digitalWrite(this.pinD, 1);
                    break;
                case 1:
                    board.digitalWrite(this.pinA, 0);
                    board.digitalWrite(this.pinB, 0);
                    board.digitalWrite(this.pinC, 1);
                    board.digitalWrite(this.pinD, 0);
                    break;
                case 2:
                    board.digitalWrite(this.pinA, 0);
                    board.digitalWrite(this.pinB, 1);
                    board.digitalWrite(this.pinC, 0);
                    board.digitalWrite(this.pinD, 0);
                    break;
                case 3:
                    board.digitalWrite(this.pinA, 1);
                    board.digitalWrite(this.pinB, 0);
                    board.digitalWrite(this.pinC, 0);
                    board.digitalWrite(this.pinD, 0);
                    break;
            }
        }
        if (this.mtDir == true)
            this.mtStep++;
        else
            this.mtStep--;
        this.mtBit++;
        if (this.mtBit > 3)
            this.mtBit = 0;
        //console.log(this.pinA + ' , ' + this.pinB + ' , ' + this.pinC + ' , ' + this.pinD);
        //console.log(this.mtBit + ' , ' + this.mtStep + ' , ' + this.mtDir);
    }
    //************ Public methods ************
    getAngle() {
        return this.output.angle = this.mtStep * rotConfig.degPerStep;
    }
    getClear() {
        return this.clear;
    }
    invertClear() {
        this.clear = !clear;
    }
    //getObstacleStatus() {
    //    if (this.output.distances[this.output.distances.length - 1] <= 30) { //Signal for AGV to stop driving
    //        this.obstacleStatus = true;
    //    } else
    //        this.obstacleStatus = false;
    //    return this.obstacleStatus;
    //}
    printf() {
        //console.log('------name------');
        //console.log(this.name);
        //console.log('------id------');
        //console.log(this.id);
        console.log('------output------');
        console.log(this.output);
        //console.log('');
    }
}



var frontScanner = new Scanner('frontScanner', 0, 52, 50, 48, 46, 15, 14);
var test = 4;

//************Arduino Board has been detected************
board.on("ready", function () {
    console.log("[ARDUNIO] Here we go!");
    //------- Pinout: Modes ------- 
    //http://johnny-five.io/api/board/
    //0:DI; 1:DO; 2:AI; 3:PWM; 4:servo
    this.pinMode(frontScanner.pinA, 1);
    this.pinMode(frontScanner.pinB, 1);
    this.pinMode(frontScanner.pinC, 1);
    this.pinMode(frontScanner.pinD, 1);
    //------- Pinout: Default values -------
    this.digitalWrite(frontScanner.pinA, 0);
    this.digitalWrite(frontScanner.pinB, 0);
    this.digitalWrite(frontScanner.pinC, 0);
    this.digitalWrite(frontScanner.pinD, 0);
    //------- Interval: Rotate motors -------
    var rotateScannersInterval = setInterval(
        achiveNextStep,
        rotConfig.rotTime + rotConfig.stopTime);

    function achiveNextStep() {
        frontScanner.rotateScanner()
        frontScanner.getDistPackage();
    }
});




module.exports.frontScanner = frontScanner;
module.exports.test = test;