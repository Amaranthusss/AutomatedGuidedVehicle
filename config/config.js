const LEARNING = {
    PART_TIME: 200,
    STEPS_LIMIT: 9999999999999999
}
const SCANNERS = {
    MICROSECDONDS_PER_CM: 1e6 / 34321, //Estimated speed of sound [us/cm]
    SENSOR_MAX_RANGE: 300, //Maximum range of distance sensor -> digital low pass filter
    TRIG_PAUSE: 10, //Time at interval to sending requested ultrasonic sound
    TRIG_TIME: 10, //Length of requested ultrasonic sound for each trigger (change is not recommended) -> range of sensors
    PACKAGE_SIZE: 30, //Amount of correct read data from distance sensor -> velocity of scanners
    MOTOR_STEPS_PAUSE: 10, //Time at interval to achive single pulse step at motors -> velocity of motors
    PULSES_PER_ANGLE: 8, //Amount of pulses required to achive single angle step (recommended multiply of 4) -> velocity of scanner
    MAX_ANGLE: 40, //Limit of possible steps to change direction of motors -> size of output data array
    TIME_TO_ACHIVE_HOME: 7000,
    DELAY_TO_START: 10000
}
const AXISES = {
    
}

module.exports = {
    LEARNING,
    SCANNERS
}