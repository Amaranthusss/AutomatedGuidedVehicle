const internal = {};


var move_mode = 'manual';
const learning_partTime = 200;
const learning_stepsLimit = 9999999999999999;



module.exports = internal.Configuration = class {
    constructor() {}
    
    getMode() {
        return move_mode;
    }
    
    setMode(mode) {
        move_mode = mode;
    }
    
    getPartTime() {
        return learning_partTime;
    }
    
    getStepsLimit() {
        return learning_stepsLimit;
    }
}