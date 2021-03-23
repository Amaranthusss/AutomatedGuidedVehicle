const SERVER = {
    PORT: 8080, //Port of server with frontend - website (Express)
    ASYNC_PORT: 8081 //Port of asynchronous server communicate with frontend (WebSocket)
}
const LEARNING = {
    PART_TIME: 200,
    STEPS_LIMIT: 9999999999999999
}
const SCANNERS = {
    MICROSECDONDS_PER_CM: 1e6 / 34321, //Estimated speed of sound [us/cm]
    SENSOR_MAX_RANGE: 300, //Maximum range of distance sensor -> digital low pass filter
    SENSOR_MIN_RANGE: 3, //Minimum rangoe of distance sensor -> digital low pass filter
    TRIG_PAUSE: 10, //Time at interval to sending requested ultrasonic sound
    TRIG_TIME: 10, //Length of requested ultrasonic sound for each trigger (change is not recommended) -> range of sensors
    PACKAGE_SIZE: 30, //Amount of correct read data from distance sensor -> velocity of scanners
    MOTOR_STEPS_PAUSE: 7, //Time at interval to achive single pulse step at motors -> velocity of motors
    PULSES_PER_ANGLE: 8, //Amount of pulses required to achive single angle step (recommended multiply of 4) -> velocity of scanner
    MAX_ANGLE: 35, //Limit of possible steps to change direction of motors -> size of output data array
    TIME_TO_ACHIVE_HOME: 7000, //Time to achive home position (minimum value of angle) by scanners, time is started at arduino's ready status
    DELAY_TO_START: 10000 //Time of delay to start scanning by scanners, time is started at arduino's ready status
}
const AXISES = {
    PWM: 150, //Higher value of PWM should use more current
    MAX_PWM_FREQ: 2000, //Stepper drivers can reach frequency up to 20kHz
    MIN_PWM_FREQ: 0, //Lowest value of frequency, moment of turning off axis' work
    RISING_FREQ_STEP: 100, //Slew speed of velocity - linear
    FALLING_FREQ_STEP: 300, //Speed of descent of velocity - linear
    ENCODING_INTERVAL: 1, //Time at interval to read and compare state at encoders of each axis
    ENABLE: false, //Default false is enable, true is disable
    DIRECTION: true, //Default false means backward, true means forward
    ACCELERATION: 2000, //Time at interval to get next level of PWM frequency for each axis
    WHEELS_RADIUS: 0.05, //Radius of each wheel [m]
    HARDWARE_PUL_PER_REV: 200 //Hardware configuration placed at stepper drivers at DIP pins
}
const LIGHTING = {
    LEFT_STRIP_LENGTH: 12,
    MIDLE_STRIP_LENGTH: 12,
    RIGHT_STRIP_LENGTH: 12,
    GAMMA: 2.8,
    SHIFTING_INTERVAL: 300, //Time between shifting animation at shade effect
    DIFFERENCE_AT_SHADING: 5 //Difference at RGB for shade animation effect
}
module.exports = {
    SERVER,
    AXISES,
    LEARNING,
    SCANNERS,
    LIGHTING
}