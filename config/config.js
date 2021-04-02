const SERVER = {
    PORT: 8080, //Port of server with frontend - website (Express)
    ASYNC_PORT: 8081 //Port of asynchronous server communicate with frontend (WebSocket)
}
const RASPBERRYPI = {
    CHECK_TEMPERATURE_INTERVAL: 5000,
    COOLER_TEMP_START: 37,
    COOLER_TEMP_STOP: 32,
    PWM_BOOST_AT_WARM: 4,
    PWM_BOOST_AT_HOT: 5,
    PWM_BOOST_AT_OVERHEATING: 10
}
const MOTHERBOARD = {
    CURRENT_SENSOR: {
        SENSITIVITY: 66, //mV/A
        ARDUINO_VOLTAGE: 5000, //mV
        OFFSET_FOR_ZERO_CURRENT: 2500 //mV
    },
    VOLTAGE_SENSOR: {
        ARDUNIO_REFERENCE: 5.015, //measured voltage at arduino output pin
        LOWER_RESISTANCE: 11000, //measured resistance of lower resistor
        HIGHER_RESISTANCE: 33000, //measured resistance of higher resistor
        LOW_VOLTAGE_LEVEL: 12 //value to detect low level energy power at accumulators
    }
}
const LEARNING = {
    FOLDER: './paths/'
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
    FREQ_ARRAY: [320, 400, 500, 800, 1000, 1600, 2000, 4000, 8000], //10, 100, 200, 320, 400, 500, 800, 1000, 1600, 2000, 4000
    PWM_LOW: 2, //Higher value of PWM should use more current but it is not required (PWM signals are based at edges)
    PWM_MEDIUM: 240,
    MEDIUM_PWM_FREQ_MIN: 1600,
    ENCODING_INTERVAL: 1, //Time at interval to read and compare state at encoders of each axis
    ENABLE: false, //Default false is enable, true is disable
    DIRECTION: false, //
    ACCELERATION: 1000, //Time at interval to get next level of PWM frequency for each axis
    WHEELS_RADIUS: 0.05, //Radius of each wheel [m]
    HARDWARE_PUL_PER_REV: 1600, //Hardware configuration placed at stepper drivers at DIP pins
}
const LIGHTING = {
    LEFT_STRIP_LENGTH: 12, //Amount of diodes at left strip
    MIDDLE_STRIP_LENGTH: 12, //Amount of diodes at middle strip
    RIGHT_STRIP_LENGTH: 12, //Amount of diodes at right strip
    GAMMA: 2.8, //Recommended gamma of lighting at all strips
    SHIFTING_INTERVAL: 300, //Time between shifting animation at shade effect
    DIFFERENCE_AT_SHADING: 5, //Difference at RGB for shade animation effect
    DYNAMIC_RAINBOW_DELAY: 500 //Time between changing color of diodes at strip
}
module.exports = {
    SERVER,
    RASPBERRYPI,
    MOTHERBOARD,
    AXISES,
    LEARNING,
    SCANNERS,
    LIGHTING
}