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
    rearScanner.pinTrig.trigger(10, 1);
}

//-------Arduino Mega-------
const board = require("./arduino");
const Pinout = require("./pinout");
//-------JSON Control-------
const JsonCtrl = require("./jsonCtrl");
const jsonCtrl = new JsonCtrl();
//ToDo: Save actual position of scanner to file but there still isn't feedback about current scanner's position

class Scanner {
    constructor(name, id, pinout) {
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
        this.A = pinout.A;
        this.B = pinout.B;
        this.C = pinout.C;
        this.D = pinout.D;
        this.mtBit = 0;
        this.mtStep = 0;
        this.mtDir = true;
        //Ultrasonic Sensor
        this.pinTrig = new Gpio(pinout.TRIG, { mode: Gpio.OUTPUT });
        this.pinEcho = new Gpio(pinout.ECHO, { mode: Gpio.INPUT, alert: true });
        //Processing variables
        this.clear = false;
        this.obstacleStatus = true;
        this.currentLowest = 0;
        this.currentHighest = 500;
    }
    ini () {
        this.watchHCSR04();
        this.pinTrig.digitalWrite(0); // Make sure trigger is low
    }
    //************ Proximity Sensor ************
    getDistPackage() {
        rearScanner.pinTrig.trigger(10, 1);

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
                if (currentValue < 300 && currentValue > 5) //Filtr errors, 250 cm is sensor's max range
                {
                    i++;
                    currentPackage[i] = currentValue;
                    if (currentPackage[i] > this.currentHighest)
                        this.currentHighest = currentPackage[i];
                    if (currentPackage[i] < this.currentLowest)
                        this.currentLowest = currentPackage[i];
                    if (i >= 1) //Package has been measured
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
                    board.digitalWrite(this.A, 1);
                    board.digitalWrite(this.B, 0);
                    board.digitalWrite(this.C, 0);
                    board.digitalWrite(this.D, 0);
                    break;
                case 1:
                    board.digitalWrite(this.A, 0);
                    board.digitalWrite(this.B, 1);
                    board.digitalWrite(this.C, 0);
                    board.digitalWrite(this.D, 0);
                    break;
                case 2:
                    board.digitalWrite(this.A, 0);
                    board.digitalWrite(this.B, 0);
                    board.digitalWrite(this.C, 1);
                    board.digitalWrite(this.D, 0);
                    break;
                case 3:
                    board.digitalWrite(this.A, 0);
                    board.digitalWrite(this.B, 0);
                    board.digitalWrite(this.C, 0);
                    board.digitalWrite(this.D, 1);
                    break;
            }
        } else {
            switch (this.mtBit) {
                case 0:
                    board.digitalWrite(this.A, 0);
                    board.digitalWrite(this.B, 0);
                    board.digitalWrite(this.C, 0);
                    board.digitalWrite(this.D, 1);
                    break;
                case 1:
                    board.digitalWrite(this.A, 0);
                    board.digitalWrite(this.B, 0);
                    board.digitalWrite(this.C, 1);
                    board.digitalWrite(this.D, 0);
                    break;
                case 2:
                    board.digitalWrite(this.A, 0);
                    board.digitalWrite(this.B, 1);
                    board.digitalWrite(this.C, 0);
                    board.digitalWrite(this.D, 0);
                    break;
                case 3:
                    board.digitalWrite(this.A, 1);
                    board.digitalWrite(this.B, 0);
                    board.digitalWrite(this.C, 0);
                    board.digitalWrite(this.D, 0);
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
        //console.log(this.A + ' , ' + this.B + ' , ' + this.C + ' , ' + this.D);
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



var rearScanner = new Scanner('rearScanner', 0, Pinout.ultraSonicSensorRear);

//************Arduino Board has been detected************
board.on("ready", function () {
    console.log("[ARDUNIO] Here we go!");
    //------- Pinout: Modes ------- 
    //http://johnny-five.io/api/board/
    //0:DI; 1:DO; 2:AI; 3:PWM; 4:servo
    this.pinMode(rearScanner.A, 1);
    this.pinMode(rearScanner.B, 1);
    this.pinMode(rearScanner.C, 1);
    this.pinMode(rearScanner.D, 1);
    //------- Pinout: Default values -------
    this.digitalWrite(rearScanner.A, 0);
    this.digitalWrite(rearScanner.B, 0);
    this.digitalWrite(rearScanner.C, 0);
    this.digitalWrite(rearScanner.D, 0);
    //------- Interval: Rotate motors -------
    var rotateScannersInterval = setInterval(
        achiveNextStep,
        rotConfig.rotTime + rotConfig.stopTime);

    function achiveNextStep() {
        rearScanner.rotateScanner()
        rearScanner.getDistPackage();
    }
});




module.exports.rearScanner = rearScanner;