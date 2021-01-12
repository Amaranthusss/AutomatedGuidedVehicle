
const internal = {};
const fs = require('fs');

//-------Configuration-------
const Configuration = require("./config");
const config = new Configuration();
//-------Movements-------
const Movements = require("./movements");
const move = new Movements();
var autoModeNodes = [];
//-------JSON Control-------
const JsonCtrl = require("./jsonCtrl");
const jsonCtrl = new JsonCtrl();
//-------Sensors Controller-------
const SensorsController = require("./sensors");
const sensorsController = new SensorsController();


var step = 0;

var savedVelocityList = [];
var savedVelocityList_n = 0;
var saveVeloctyInterval = null;

var brakingAutoMode = null;


var startTime = null;

module.exports = internal.Learning = class {
    constructor() {
        this.forwardHMI = new timeHMI('HMI_up');
        this.backwardHMI = new timeHMI('HMI_down');
        this.leftHMI = new timeHMI('HMI_left');
        this.rightHMI = new timeHMI('HMI_right');
        this.speed = null;
        this.startSpeed = null;
        this.minSpeed = null;
        this.maxSpeed = null;
        this.allNodes = [];
        this.bttnStopT = null;
        this.bttnDiff = null;
        this.bttnFirstT = null;
    }

    startTimerHMI(key) {
        if (this.bttnStopT != null)
            this.bttnDiff = Date.now() - this.bttnStopT;
        if (this.bttnDiff == null)
            this.bttnFirstT = Date.now();
        saveVeloctyInterval = setInterval(saveVelocityToList, config.getPartTime());
        startTime = Date.now();

        function saveVelocityToList() {
            savedVelocityList[savedVelocityList_n] = move.getCurrentSpeed();
            savedVelocityList_n++;
//            console.log(savedVelocityList[savedVelocityList_n - 1], move.getCurrentSpeed());
        }
    }
    stopTimerHMI(key) {
        if (this.bttnDiff == null)
            this.bttnDiff = Date.now() - this.bttnFirstT;
        this.bttnStopT = Date.now();
        var dynTime = this.bttnStopT - startTime;
        var partTime = 0;
        var amountOfParts = 0;
        var deVelocity = 0;
        this.speed = move.getCurrentSpeed();
        for (var i = 0; i < config.getStepsLimit(); i++)
        {
            if (savedVelocityList[amountOfParts] == undefined)
                deVelocity = this.speed;
            else
                deVelocity = savedVelocityList[amountOfParts];
            if (dynTime >= config.getPartTime())
            {
                partTime = config.getPartTime();
                dynTime = dynTime - config.getPartTime();
                this.allNodes.push([
                    partTime, //time
                    key, //key
                    deVelocity, //start velocity
                    this.speed, //end velocity
                    this.bttnDiff
                ]);
                amountOfParts++;
            } else
            {
                partTime = dynTime;
                this.allNodes.push([
                    partTime, //time
                    key, //key
                    deVelocity, //start velocity
                    this.speed, //end velocity
                    this.bttnDiff
                ]);
                amountOfParts++;
                savedVelocityList = [];
                savedVelocityList_n = 0;
                clearInterval(saveVeloctyInterval);
                break;
            }

        }
        console.log(this.allNodes);
    }

    turnOffLearningMode(path) {
        console.log(this.allNodes);

        jsonCtrl.writeToFile(path, JSON.stringify(this.allNodes));
        this.allNodes = []; //Clear array

    }

    activeAutoPath(path)
    {
        jsonCtrl.readFromFile(path);
        setTimeout(toDo, 1000);

        function toDo()
        {
            if (!sensorsController.status()) {
                return;
            }
            autoModeNodes = jsonCtrl.getFilesData();
            console.log('autoModeNodes wartosc: ' + autoModeNodes);
            console.log(autoModeNodes);
            var i;
            const sleep = (milliseconds) => {
                return new Promise(resolve => setTimeout(resolve, milliseconds))
            }
            step = 0;
            const doSomething = async () => {
                for (i = 0; i < autoModeNodes.length; i++)
                {
                    if (!sensorsController.status())
                    {
                        step = i;
                        return;
                    }

                    var checkDir_Up_Interval,
                            checkDir_Down_Interval,
                            checkDir_Left_Interval,
                            checkDir_Right_Interval,
                            checkDir_Time = 10; //Same config time has to be changed in main.js
                    function checkDirInterval()
                    {
                        move.checkDir();
                    }
                    var arr1D = String(autoModeNodes[i]);
                    var node = arr1D.split(",");
//                    console.log('[s', i, '] Starting');
                    //await sleep(node[0]);
                    var nextArr1D = String(autoModeNodes[i + 1]);
                    var nextNode = nextArr1D.split(",");
                    console.log("[s" + i + "]"
                            + " time: " + node[0]
                            + " key: " + node[1]
                            + " current: " + node[2]
                            + " target: " + node[3]
                            + " braking: " + node[4]);
                    move.setSpeed(node[2]);
                    if (node[1] == 'up')
                    {
                        move.setForwardClicked(true);
                        checkDir_Up_Interval = setInterval(checkDirInterval, checkDir_Time);
                        move.checkDir();
                    } else if (node[1] == 'down')
                    {
                        move.setBackwardClicked(true);
                        checkDir_Down_Interval = setInterval(checkDirInterval, checkDir_Time);
                        move.checkDir();
                    } else if (node[1] == 'left')
                    {
                        move.setLeftClicked(true);
                        checkDir_Left_Interval = setInterval(checkDirInterval, checkDir_Time);
                        move.checkDir();
                    } else if (node[1] == 'right')
                    {
                        move.setRightClicked(true);
                        checkDir_Right_Interval = setInterval(checkDirInterval, checkDir_Time);
                        move.checkDir();
                    }


//                    console.log('[s', i, '] Waiting', node[0]);
                    await sleep(node[0]);

//                    console.log('[s', i, '] Braking', node[4]);

                    if (node[1] == 'up')
                    {
                        clearInterval(checkDir_Up_Interval);
                        move.checkDir();
                    } else if (node[1] == 'down')
                    {
                        clearInterval(checkDir_Down_Interval);
                        move.checkDir();
                    } else if (node[1] == 'left')
                    {
                        clearInterval(checkDir_Left_Interval);
                        move.checkDir();
                    } else if (node[1] == 'right')
                    {
                        clearInterval(checkDir_Right_Interval);
                        move.checkDir();
                    }

                    if (nextNode[4] != node[4] && nextNode[3] != node[3])
                    {
                        brakingAutoMode = true;
                        if (node[1] == 'up')
                        {
                            move.setForwardClicked(false);
                            clearInterval(checkDir_Up_Interval);
                            move.checkDir();
                            move.forwardStop();
                        } else if (node[1] == 'down')
                        {
                            move.setBackwardClicked(false);
                            clearInterval(checkDir_Down_Interval);
                            move.checkDir();
                            move.forwardStop();
                        } else if (node[1] == 'left')
                        {
                            move.setLeftClicked(false);
                            clearInterval(checkDir_Left_Interval);
                            move.checkDir();
                            move.forwardStop();
                        } else if (node[1] == 'right')
                        {
                            move.setRightClicked(false);
                            clearInterval(checkDir_Right_Interval);
                            move.checkDir();
                            move.forwardStop();
                        }
                        //Waiting for velocity reduction
                        await sleep(node[4]);
//                        if (move.getCurrentSpeed() == 0)
//                            await sleep(0); //Zero has been reached before counted time
                        brakingAutoMode = false;
                    }
                }

            }

            doSomething();



        }
    }

    resumeAutoPath(path)
    {
        //jsonCtrl.readFromFile(path);
        setTimeout(toDo, 1000);

        function toDo()
        {
            if (!sensorsController.status()) {
                return;
            }
            //autoModeNodes = jsonCtrl.getFilesData();
            console.log('autoModeNodes wartosc: ' + autoModeNodes);
            console.log(autoModeNodes);
            var i;
            const sleep = (milliseconds) => {
                return new Promise(resolve => setTimeout(resolve, milliseconds))
            }

            const doSomething = async () => {
                for (i = step; i < autoModeNodes.length; i++)
                {
                    if (!sensorsController.status())
                    {
                        step = i;
                        return;
                    }

                    var checkDir_Up_Interval,
                            checkDir_Down_Interval,
                            checkDir_Left_Interval,
                            checkDir_Right_Interval,
                            checkDir_Time = 10; //Same config time has to be changed in main.js
                    function checkDirInterval()
                    {
                        move.checkDir();
                    }
                    var arr1D = String(autoModeNodes[i]);
                    var node = arr1D.split(",");
                    console.log("[AutoPath] Node: " + i
                            + " time: " + node[0]
                            + " key: " + node[1]);
                    console.log('[s', i, '] Starting');
                    //await sleep(node[0]);
                    if (node[1] == 'up')
                    {
                        move.setForwardClicked(true);
                        checkDir_Up_Interval = setInterval(checkDirInterval, checkDir_Time);
                        move.checkDir();
                    } else if (node[1] == 'down')
                    {
                        move.setBackwardClicked(true);
                        checkDir_Down_Interval = setInterval(checkDirInterval, checkDir_Time);
                        move.checkDir();
                    } else if (node[1] == 'left')
                    {
                        move.setLeftClicked(true);
                        checkDir_Left_Interval = setInterval(checkDirInterval, checkDir_Time);
                        move.checkDir();
                    } else if (node[1] == 'right')
                    {
                        move.setRightClicked(true);
                        checkDir_Right_Interval = setInterval(checkDirInterval, checkDir_Time);
                        move.checkDir();
                    }

                    console.log('[s', i, '] Waiting');
                    await sleep(node[0]);
                    console.log('[s', i, '] Braking');

                    if (node[1] == 'up')
                    {
                        move.setForwardClicked(false);
                        clearInterval(checkDir_Up_Interval);
                        move.checkDir();
                        move.forwardStop();
                    } else if (node[1] == 'down')
                    {
                        move.setBackwardClicked(false);
                        clearInterval(checkDir_Down_Interval);
                        move.checkDir();
                        move.forwardStop();
                    } else if (node[1] == 'left')
                    {
                        move.setLeftClicked(false);
                        clearInterval(checkDir_Left_Interval);
                        move.checkDir();
                        move.forwardStop();
                    } else if (node[1] == 'right')
                    {
                        move.setRightClicked(false);
                        clearInterval(checkDir_Right_Interval);
                        move.checkDir();
                        move.forwardStop();
                    }
                }

            }

            doSomething();



        }
    }

};


function doDelay(time)
{
    (function (i) {
        setTimeout(function () { }, time * i);
    })(i);
}



function json2array(json) {
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function (key) {
        result.push(json[key]);
    });
    return result;
}

//Timers to Learning
class timeHMI {
    constructor(timer)
    {
        this.timer = timer;
        this.status = false;
        this.time;
        this.begin;
        this.end;
        this.speedAtStart;
    }
    /** Start a timer */
    start(speedAtStart)
    {
        if (this.status == false)
        {
            this.speedAtStart = speedAtStart;
            console.time(this.timer);
            this.begin = Date.now();
            this.status = true;
        }
    }
    /** Finish a timer
     * @return [0] - time [ms] that has elapsed since the start() function, [1] - current velocity at the start() function */
    stop()
    {
        if (this.status == true)
        {
            console.timeEnd(this.timer);
            this.end = Date.now();
            this.status = false;
            return [
                this.time = this.end - this.begin,
                this.speedAtStart
            ];
        }
    }
}




/*
 IF #LetLearn THEN
 //Start counting the learning time
 #DB_TON_CountedLearningTime(IN : = true,
 PT : = T#1h,
 ET => #CountedLearningTime);
 //Save value of time in pressing any button moment
 IF #StopCountingTime_Forward OR #StopCountingTime_Backward OR #StopCountingTime_Left OR #StopCountingTime_Right THEN
 #TimeOfReleasePressing : = #CountedLearningTime;
 END_IF;
 //Operator clicks some button at HMI
 #DB_R_TRIG_GoToForward(CLK : = #GoTo_Forward,
 Q => #StartCountingTime_Forward);
 #DB_R_TRIG_GoToBackward(CLK : = #GoTo_Backward,
 Q => #StartCountingTime_Backward);
 #DB_R_TRIG_GoToLeft(CLK : = #GoTo_Left,
 Q => #StartCountingTime_Left);
 #DB_R_TRIG_GoToRight(CLK : = #GoTo_Right,
 Q => #StartCountingTime_Right);
 //Operator releases some button at HMI
 #DB_F_TRIG_GoToForward(CLK : = #GoTo_Forward,
 Q => #StopCountingTime_Forward);
 #DB_F_TRIG_GoToBackward(CLK : = #GoTo_Backward,
 Q => #StopCountingTime_Backward);
 #DB_F_TRIG_GoToLeft(CLK : = #GoTo_Left,
 Q => #StopCountingTime_Left);
 #DB_F_TRIG_GoToRight(CLK : = #GoTo_Right,
 Q => #StopCountingTime_Right);
 //Clearing a rest networks' memories
 FOR #i_ClearingBuffor : = #NeuronsCounting + 1 TO #MaxNeuronsLength DO
 "a_NeuronNetworks".CurrentNeuronNetwork[#NeuronNetworkNumber].Network[#i_ClearingBuffor].Button : = 0;
 "a_NeuronNetworks".CurrentNeuronNetwork[#NeuronNetworkNumber].Network[#i_ClearingBuffor].PressingTime : = T#0s;
 "a_NeuronNetworks".CurrentNeuronNetwork[#NeuronNetworkNumber].Network[#i_ClearingBuffor].SetVelocity : = 0.00;
 "a_NeuronNetworks".CurrentNeuronNetwork[#NeuronNetworkNumber].Network[#i_ClearingBuffor].StartVelocity : = 0.00;
 END_FOR;
 END_IF;
 
 
 IF #StartCountingTime_Forward THEN
 #NeuronsCounting := #NeuronsCounting + 1;
 "a_NeuronNetworks".CurrentNeuronNetwork[#NeuronNetworkNumber].Network[#NeuronsCounting].StartVelocity := "b_StepperMotors".CurrentVelocity;
 "a_NeuronNetworks".CurrentNeuronNetwork[#NeuronNetworkNumber].Network[#NeuronsCounting].Button := 1;
 "a_NeuronNetworks".CurrentNeuronNetwork[#NeuronNetworkNumber].Network[#NeuronsCounting].PauseTime := #CountedLearningTime - #TimeOfReleasePressing;
 #CreatingNeuron_Forward := 1;
 ELSIF #StartCountingTime_Backward THEN
 #NeuronsCounting := #NeuronsCounting + 1;
 "a_NeuronNetworks".CurrentNeuronNetwork[#NeuronNetworkNumber].Network[#NeuronsCounting].StartVelocity := "b_StepperMotors".CurrentVelocity;
 "a_NeuronNetworks".CurrentNeuronNetwork[#NeuronNetworkNumber].Network[#NeuronsCounting].Button := 2;
 "a_NeuronNetworks".CurrentNeuronNetwork[#NeuronNetworkNumber].Network[#NeuronsCounting].PauseTime := #CountedLearningTime - #TimeOfReleasePressing;
 #CreatingNeuron_Backward := 1;
 ELSIF #StartCountingTime_Left THEN
 #NeuronsCounting := #NeuronsCounting + 1;
 "a_NeuronNetworks".CurrentNeuronNetwork[#NeuronNetworkNumber].Network[#NeuronsCounting].StartVelocity := "b_StepperMotors".CurrentVelocity;
 "a_NeuronNetworks".CurrentNeuronNetwork[#NeuronNetworkNumber].Network[#NeuronsCounting].Button := 3;
 "a_NeuronNetworks".CurrentNeuronNetwork[#NeuronNetworkNumber].Network[#NeuronsCounting].PauseTime := #CountedLearningTime - #TimeOfReleasePressing;
 #CreatingNeuron_Left := 1;
 ELSIF #StartCountingTime_Right THEN
 #NeuronsCounting := #NeuronsCounting + 1;
 "a_NeuronNetworks".CurrentNeuronNetwork[#NeuronNetworkNumber].Network[#NeuronsCounting].StartVelocity := "b_StepperMotors".CurrentVelocity;
 "a_NeuronNetworks".CurrentNeuronNetwork[#NeuronNetworkNumber].Network[#NeuronsCounting].Button := 4;
 "a_NeuronNetworks".CurrentNeuronNetwork[#NeuronNetworkNumber].Network[#NeuronsCounting].PauseTime := #CountedLearningTime - #TimeOfReleasePressing;
 #CreatingNeuron_Right := 1;
 END_IF;
 
 
 //#debuggertimers := T#0.408s;
 IF #CreatingNeuron_Forward THEN //Forward button is still pressed
 #PressingButtonTime_Forward(IN := #CreatingNeuron_Forward,
 PT := T#1h);
 "a_NeuronNetworks".CurrentNeuronNetwork[#NeuronNetworkNumber].Network[#NeuronsCounting].PressingTime := #PressingButtonTime_Forward.ET + #debuggertimers;
 END_IF;
 IF #CreatingNeuron_Backward THEN //Backward button is still pressed
 #PressingButtonTime_Backward(IN := #CreatingNeuron_Backward,
 PT := T#1h);
 "a_NeuronNetworks".CurrentNeuronNetwork[#NeuronNetworkNumber].Network[#NeuronsCounting].PressingTime := #PressingButtonTime_Backward.ET + #debuggertimers;
 END_IF;
 IF #CreatingNeuron_Left THEN //Turn Left button is still pressed
 #PressingButtonTime_Left(IN := #CreatingNeuron_Left,
 PT := T#1h);
 "a_NeuronNetworks".CurrentNeuronNetwork[#NeuronNetworkNumber].Network[#NeuronsCounting].PressingTime := #PressingButtonTime_Left.ET + #debuggertimers;
 END_IF;
 IF #CreatingNeuron_Right THEN //Turn Right button is still pressed
 #PressingButtonTime_Right(IN := #CreatingNeuron_Right,
 PT := T#1h);
 "a_NeuronNetworks".CurrentNeuronNetwork[#NeuronNetworkNumber].Network[#NeuronsCounting].PressingTime := #PressingButtonTime_Right.ET + #debuggertimers;
 END_IF;
 
 
 IF #StopCountingTime_Forward OR #StopCountingTime_Backward OR #StopCountingTime_Left OR #StopCountingTime_Right THEN
 "a_NeuronNetworks".CurrentNeuronNetwork[#NeuronNetworkNumber].Network[#NeuronsCounting].SetVelocity := "b_StepperMotors".CurrentVelocity;
 #CreatingNeuron_Forward := 0;
 #CreatingNeuron_Backward := 0;
 #CreatingNeuron_Left := 0;
 #CreatingNeuron_Right := 0;
 RESET_TIMER(#PressingButtonTime_Forward);
 RESET_TIMER(#PressingButtonTime_Backward);
 RESET_TIMER(#PressingButtonTime_Left);
 RESET_TIMER(#PressingButtonTime_Right);
 
 END_IF;
 
 //Mode LetLearn has been turned off
 #DB_F_TRIG_LetLearn(CLK := #LetLearn,
 Q => #LetLearnNegativeEdge);
 IF #LetLearnNegativeEdge THEN
 "a_NeuronNetworks".CurrentNeuronNetwork[#NeuronNetworkNumber].NeuronsAmount := #NeuronsCounting;
 "a_NeuronNetworks".CurrentNeuronNetwork[#NeuronNetworkNumber].Network[1].PauseTime := "a_NeuronNetworks".CurrentNeuronNetwork[#NeuronNetworkNumber].Network[2].PauseTime;
 "a_NeuronNetworks".CurrentNeuronNetwork[#NeuronNetworkNumber].Network[#NeuronsCounting].PauseTime := "a_NeuronNetworks".CurrentNeuronNetwork[#NeuronNetworkNumber].Network[#NeuronsCounting].PauseTime + T#1s;
 #DB_TON_DelayTimeToResetNeuronsCounting(IN := true,
 PT := T#2s); //Start count time to delay of reset
 RESET_TIMER(#DB_TON_CountedLearningTime);
 END_IF;
 
 //After 2s reset value of neurons counting
 IF #DB_TON_DelayTimeToResetNeuronsCounting.Q THEN
 #NeuronsCounting := 0;
 RESET_TIMER(#DB_TON_DelayTimeToResetNeuronsCounting);
 END_IF;
 
 
 
 
 */
