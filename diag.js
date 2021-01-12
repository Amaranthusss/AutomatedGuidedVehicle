const internal = {};

//Diagnosis CPU temperature
var pi = require('node-raspi');
var temperature, voltage = null;


module.exports = internal.Diagnosis = class {
    constructor() {
    }
    ctrPanel() {
        /**
         * Shows at console temperature and voltage at Raspberry Pi's CPU
         * 
         */
        console.log("Temp: " + temperature + ", Volt: " + voltage / 1000);
    }
    getTemp() {
        /**
         * Returns value of last measured temperature at Raspberry Pi's CPU
         * 
         */
        return temperature;
    }
    getVoltage()
    {
        /**
         * Returns value of last measured voltage at Raspberry Pi's CPU
         * 
         */
        return voltage;
    }
    refreshData()
    {
        /**
         * Measures temperature and voltage at Raspberry Pi's CPU
         * At console can be buffored alert of pigpio
         * 
         */
        temperature = pi.getThrm();
        voltage = pi.getVcc();
    }

};

/*
 if (buttonStartStop.readSync() === 1) {
 console.log("Przycisk wcisniety");
 }
 
 if (redLedButton.readSync() === 0) { //check the pin state, if the state is 0 (or off)
 redLedButton.writeSync(1); //set pin state to 1 (turn LED on)
 greenLedButton.writeSync(0); //set pin state to 1 (turn LED on)
 } else {
 redLedButton.writeSync(0); //set pin state to 0 (turn LED off)
 greenLedButton.writeSync(1); //set pin state to 1 (turn LED on)
 }
 
 enLeftRear.writeSync(0);
 enRightRear.writeSync(0);
 enLeftFront.writeSync(0);
 enRightFront.writeSync(0);
 
 */