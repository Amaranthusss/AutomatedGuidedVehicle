const internal = {};

//-------Configuration-------
const Configuration = require("./config");
const config = new Configuration();
//-------Sensors Controller-------
const SensorsController = require("./sensors");
const sensorsController = new SensorsController();
//-------Learning Mode-------
//const Learning = require("./learning");
//const learning = new Learning();


//Configuration constans
var speed = 0; //Current set velocity
var maxSpeed = 250; //Up limit of velocity
var minSpeed = 1; //Down limit of velocity


var mode = 0;
var maxLimitEN = 0;
var minLimitEN = 0;
var timedEN = 0;
var brakingEN = 0;
var brakingLimitEN = 0;
var h = 0;


var Gpio = require('pigpio').Gpio, //include pigpio to interact with the STEPS GPIO
        step1 = new Gpio(16, {mode: Gpio.OUTPUT, pullUpDown: Gpio.PUD_UP}), //left rear step
        step2 = new Gpio(13, {mode: Gpio.OUTPUT, pullUpDown: Gpio.PUD_UP}), //right front step
        step3 = new Gpio(12, {mode: Gpio.OUTPUT, pullUpDown: Gpio.PUD_UP}), //right rear step
        step4 = new Gpio(22, {mode: Gpio.OUTPUT, pullUpDown: Gpio.PUD_UP}); //left front step

var GpioDIR = require('onoff').Gpio; //include onoff to interact with the DIRECTION GPIO
var dirLeftRear = new GpioDIR(20, 'out');
var dirRightRear = new GpioDIR(19, 'out');
var dirRightFront = new GpioDIR(5, 'out');
var dirLeftFront = new GpioDIR(27, 'out');

var GpioEN = require('onoff').Gpio; //include onoff to interact with the ENABLES GPIO
var enLeftRear = new GpioEN(21, 'out');
var enRightRear = new GpioEN(26, 'out');
var enRightFront = new GpioEN(6, 'out');
var enLeftFront = new GpioEN(17, 'out');

var forwardClicked = false;
var backwardClicked = false;
var leftClicked = false;
var rightClicked = false;

var arrayDir = new Array(4);


module.exports = internal.Movements = class {
    constructor() {}
    
    getCurrentSpeed() {
        return speed;
    }

    setSpeed(s) {
        speed = s;
    }

    initialization()
    {
        motorCtrl("LF", "off");
        motorCtrl("RF", "off");
        motorCtrl("LR", "off");
        motorCtrl("RR", "off");
    }
    setForwardClicked(x1)
    {
        forwardClicked = x1;
    }
    setBackwardClicked(x2)
    {
        backwardClicked = x2;
    }
    setLeftClicked(x3)
    {
        leftClicked = x3;
    }
    setRightClicked(x4)
    {
        rightClicked = x4;
    }
    goForward()
    {
        //Jedź przed siebie
        motorCtrl("LF", "on", 1);
        motorCtrl("RF", "on", 1);
        motorCtrl("LR", "on", 1);
        motorCtrl("RR", "on", 1);
        //console.log("FORWARD");
        this.checkDirInputs();
    }

    goBackward()
    {
        //Cofaj
        motorCtrl("LF", "on", 0);
        motorCtrl("RF", "on", 0);
        motorCtrl("LR", "on", 0);
        motorCtrl("RR", "on", 0);
        //console.log("BACKWARD");
        this.checkDirInputs();
    }

    goTurnLeft()
    {
        //Obróć w lewo
        motorCtrl("LF", "on", 0);
        motorCtrl("RF", "on", 1);
        motorCtrl("LR", "on", 0);
        motorCtrl("RR", "on", 1);
        //console.log("TURNLEFT");
        this.checkDirInputs();
    }

    goTurnRight()
    {
        //Obróć w prawo
        motorCtrl("LF", "on", 1);
        motorCtrl("RF", "on", 0);
        motorCtrl("LR", "on", 1);
        motorCtrl("RR", "on", 0);
        //console.log("TURNRIGHT");
        this.checkDirInputs();
    }

    goForwardLeft()
    {
        //Jedź w lewo i do przodu
        motorCtrl("LF", "off");
        motorCtrl("RF", "on", 1);
        motorCtrl("LR", "on", 1);
        motorCtrl("RR", "off");
        //console.log("FORWARD_LEFT");
        this.checkDirInputs();

    }
    goForwardRight()
    {
        //Jedź w prawo i do przodu
        motorCtrl("LF", "on", 1);
        motorCtrl("RF", "off");
        motorCtrl("LR", "off");
        motorCtrl("RR", "on", 1);
        //console.log("FORWARD_RIGHT");
        this.checkDirInputs();
    }

    goBackwardLeft()
    {
        //Cofaj w lewo
        motorCtrl("LF", "on", 0);
        motorCtrl("RF", "off");
        motorCtrl("LR", "off");
        motorCtrl("RR", "on", 0);
        //console.log("BACKWARD_LEFT");
        this.checkDirInputs();
    }

    goBackwardRight()
    {
        //Cofaj w prawo
        motorCtrl("LF", "off");
        motorCtrl("RF", "on", 0);
        motorCtrl("LR", "on", 0);
        motorCtrl("RR", "off");
        //console.log("BACKWARD_RIGHT");
        this.checkDirInputs();
    }

    checkDirInputs()
    {
        arrayDir[0] = dirLeftFront.readSync();
        arrayDir[1] = dirRightFront.readSync();
        arrayDir[2] = dirLeftRear.readSync();
        arrayDir[3] = dirRightRear.readSync();
    }

    checkDir()
    {
        //COFANIE
        if (forwardClicked == false && backwardClicked == true)
        {
            if ((leftClicked == false && rightClicked == false) || (leftClicked == true && rightClicked == true))
            {
                this.goBackward();
            } else if (leftClicked == true && rightClicked == false)
            {
                this.goBackwardLeft();
            } else if (leftClicked == false && rightClicked == true)
            {
                this.goBackwardRight();
            }
            this.forwardStart();
        }
        //JAZDA NA PRZÓD
        else if (backwardClicked == false && forwardClicked == true)
        {
            if ((leftClicked == false && rightClicked == false) || (leftClicked == true && rightClicked == true))
            {
                this.goForward();
            } else if (leftClicked == true && rightClicked == false)
            {
                this.goForwardLeft();
            } else if (leftClicked == false && rightClicked == true)
            {
                this.goForwardRight();
            }
            this.forwardStart();
        }
        //JAZDA W MIEJSCU
        else
        {
            if (leftClicked == true && rightClicked == false)
            {
                this.goTurnLeft();
            } else if (leftClicked == false && rightClicked == true)
            {
                this.goTurnRight();
            }
            this.forwardStart();
        }
    }

    goFC()
    {
        clearInterval(GO);

        GO = setTimeout(goInterval, 10); //Interwał zmieniający wartość chwilowej zadanej prędkości
        function goInterval()
        {
            if (mode == 0 && config.getMode() != 'auto')
            {
                if (speed < minSpeed)
                {
                    speed = minSpeed;
                }
                if (speed < maxSpeed)
                {
                    speed = speed + 1;
                        console.log("Accelerating: speed: " + speed);
                } else
                {
                    if (maxLimitEN == 0)
                    {
                        clearInterval(GO);
                        console.log("Max speed reached");
                        mode = 2;
                        maxLimitEN = 1;
                    }
                }

            } else if (mode == 1)
            {
                if (speed > 0)
                {
                    //Hamowanie
                    if (speed >= 2 && speed < 10)
                    {
                        speed = speed - 2;
                    } else if (speed >= 10 && speed < 15)
                    {
                        speed = speed - 3;
                    } else if (speed >= 15)
                    {
                        speed = speed - 4;
                    } else
                    {
                        speed = speed - 1;
                    }
                        console.log("Braking: speed: " + speed);
                } else
                {
                    if (minLimitEN == 0)
                    {
                        clearInterval(GO);
                            console.log("Braking has been finished");
                        mode = 2;
                        minLimitEN = 1;
                        h = 1;

                        motorCtrl("LF", "off");
                        motorCtrl("RF", "off");
                        motorCtrl("LR", "off");
                        motorCtrl("RR", "off");

                    }
                }
            }

            timedEN = 0;
            brakingLimitEN = 0;

            var a = 1;
            var b = 1;

            //Wprowadzenie wyników na wyjścia PWM
            step1.pwmWrite(Math.round(speed * a));
            step2.pwmWrite(Math.round(speed * b));
            step3.pwmWrite(Math.round(speed * b));
            step4.pwmWrite(Math.round(speed * a));
            console.log("EN[LR:" + enLeftRear.readSync() + " RR:"+ enRightRear.readSync() + " RF:" + enRightFront.readSync() + " LF:" + enLeftFront.readSync()+"]");
        }
    }

    forwardStart()
    {
        if (timedEN == 0)
        {
            h = 0;
            brakingEN = 0;
            timedEN = 1;
            mode = 0;
            if (dirLeftFront.readSync() == arrayDir[0] && dirRightFront.readSync() == arrayDir[1] && dirLeftRear.readSync() == arrayDir[2] && dirRightRear.readSync() == arrayDir[3])
            {
                this.goFC();
            }
            minLimitEN = 0;
        }

    }

    forwardStop()
    {
        if (forwardClicked == false && backwardClicked == false && leftClicked == false && rightClicked == false)
        {
            brakingEN = 1;
            timedEN = 1;
            mode = 1;
            this.goFC();
            maxLimitEN = 0;
        }
    }
    checkbrakingFC()
    {
        if (brakingEN == 1 && brakingLimitEN == 0 && h == 0)
        {
            brakingLimitEN = 1;
            this.goFC();
        }
    }
};
var GO;

function motorCtrl(x, e, d)
{
    if (sensorsController.status())
        if (e == "on")
        {
            switch (x)
            {
                case "LF":
                    if (d == true)
                        dirLeftFront.writeSync(1);
                    else
                        dirLeftFront.writeSync(0);
                    enLeftFront.writeSync(0);
                    break;
                case "RF":
                    if (d == true)
                        dirRightFront.writeSync(0);
                    else
                        dirRightFront.writeSync(1);
                    enRightFront.writeSync(0);
                    break;
                case "LR":
                    if (d == true)
                        dirLeftRear.writeSync(1);
                    else
                        dirLeftRear.writeSync(0);
                    enLeftRear.writeSync(0);
                    break;
                case "RR":
                    if (d == true)
                        dirRightRear.writeSync(0);
                    else
                        dirRightRear.writeSync(1);
                    enRightRear.writeSync(0);
                    break;
            }
        } else if (e == "off")
        {
            switch (x)
            {
                case "LF":
                    dirLeftFront.writeSync(0);
                    enLeftFront.writeSync(1);
                    break;
                case "RF":
                    dirRightFront.writeSync(0);
                    enRightFront.writeSync(1);
                    break;
                case "LR":
                    dirLeftRear.writeSync(0);
                    enLeftRear.writeSync(1);
                    break;
                case "RR":
                    dirRightRear.writeSync(0);
                    enRightRear.writeSync(1);
                    break;
            }
        } else {
            enLeftFront.writeSync(1);
            enRightFront.writeSync(1);
            enLeftRear.writeSync(1);
            enRightRear.writeSync(1);
            
        }

}