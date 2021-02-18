//_________________________ Encoders _________________________
class Encoder {
    constructor (A, B) {
        this.A = A; //Digital input of Arduino
        this.B = B; //Digital input of Arduino
    }
}
enLeftFront = new Encoder(53, 51);
enRightFront = new Encoder(49, 47);
enLeftRear = new Encoder(45, 43);
enRightRear = new Encoder(41, 39);
//_________________________ Fans _________________________
class Fan {
    constructor (PWM) {
        this.PWM = PWM; //Digital output of Arduino
    }
}
fanRaspPi = new Fan(12);
fanMotherBoard = new Fan(13);
//_________________________ RGB LED Strips _________________________
class LedRGB {
    constructor (R, G, B) {
        this.R = R; //Digital output of Arduino
        this.G = G; //Digital output of Arduino
        this.B = B; //Digital output of Arduino
    }
}
stopLight = new LedRGB(2, 3, 4);
//_________________________ RGB LED Strips _________________________
class LedStrip {
    constructor (PWM) {
        this.PWM = PWM; //Digital output of Arduino
    }
}
ledStripLeft = new LedStrip(6);
ledStripMiddle = new LedStrip(7);
ledStripRight = new LedStrip(5);
//_________________________ Ultrasonic Sensors _________________________
class UltraSonicSensor {
    constructor (ECHO, TRIG, A, B, C, D) {
        this.ECHO = ECHO; //Raspberry Pi's input
        this.TRIG = TRIG; //Raspberry Pi's output
        this.A = A; //Digital output of Arduino
        this.B = B; //Digital output of Arduino
        this.C = C; //Digital output of Arduino
        this.D = D; //Digital output of Arduino
    }
}
ultraSonicSensorFront = new UltraSonicSensor(25, 18, 46, 48, 50, 52);
ultraSonicSensorRear = new UltraSonicSensor(24, 23, 38, 40, 42, 44);
//_________________________ DHT 11 _________________________
const dhtSensor = {data: 22}; //Digital input of Arduino
//_________________________ Error Diode _________________________
const errorDiode = {state: 37}; //Digital output of Arduino
//_________________________ Voltage Sensor _________________________
const voltageSensor = {read: 0}; //Analog input of Arduino
//_________________________ Current Sensor _________________________
const currentSensor = {read: 1}; //Analog input of Arduino
//_________________________ Control Panel _________________________
const controlPanel = {
    bttn1: 24,
    bttn2: 25,
    bttn3: 26,
    bttn4: 27,
    bttn5: 28,
}; //Digital inputs of Arduino
//_________________________ Ultrasonic Sensors _________________________
class DiodesRj45 {
    constructor (YELLOW, GREEN) {
        this.YELLOW = YELLOW; //Digital output of Arduino
        this.GREEN = GREEN; //Digital output of Arduino
    }
}
rj45Left = new DiodesRj45(29, 30);
rj45Right = new DiodesRj45(31, 32);
//_________________________ Motors _________________________
class Motor {
    constructor (EN, DIR, STEP) {
        this.EN = EN; //Raspberry Pi's output
        this.DIR = DIR; //Raspberry Pi's output
        this.STEP = STEP; //Raspberry Pi's output
    }
}
motorLeftFront = new Motor(17, 27, 22);
motorRightFront = new Motor(6, 5, 13);
motorLeftRear = new Motor(21, 20, 16);
motorRightRear = new Motor(26, 19, 12);

//_________________________ Encoders _________________________
module.exports = pinout = {
    enLeftFront,
    enRightFront,
    enLeftRear,
    enRightRear,
    fanRaspPi,
    fanMotherBoard,
    stopLight,
    ledStripLeft,
    ledStripMiddle,
    ledStripRight,
    ultraSonicSensorFront,
    ultraSonicSensorRear,
    dhtSensor,
    errorDiode,
    voltageSensor,
    currentSensor,
    controlPanel,
    rj45Left,
    rj45Right,
    motorLeftFront,
    motorRightFront,
    motorLeftRear,
    motorRightRear
};