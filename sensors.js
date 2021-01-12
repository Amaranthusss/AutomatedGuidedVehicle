const internal = {};


//-------Johnny Five-------
const JohnnyFive = require("./expanderI2C");
const johnnyFive = new JohnnyFive();
//-------Proximity Sensors------- ToDo: add scanners to safety
//const ProximitySensors = require("./proximity");
//const proximitySensors = new ProximitySensors();

const amountNCSensors = 1;

var updateInterval = setInterval(_update, 1);
var array = [];
var NO = [];
var globalEn = 0;

var NC = [];


module.exports = internal.SensorsController = class {
    constructor() {}

    status() {
        /**
         * Returns enable status based at all safety sensors
         * 0 means Disable work
         * 1 means Enable work
         * 
         * Returns:
         * @param {USInt}   global_enable    Range: 0 or 1;
         */
        globalEn = 1;
        for (var i = 0; i < array.length; i++)
        {
            if (array[i] == 1)
            {
                globalEn = 0;
            }
        }
        return globalEn;
    }

    getValues() {
        return array;
    }

}

function _update()
{
    NC = [
        johnnyFive.getValue(7)
    ];
    for (var i = 0; i < NC.length; i++)
    {
        //console.log('[NC ', i, ']', NC[i]);
        if (NC[i] == 1) {
            NC[i] = 0;
        } else {
            NC[i] = 1;
        }
    }
    array = [
        //proximitySensors.getState(0),
        NC[0]
    ]
}