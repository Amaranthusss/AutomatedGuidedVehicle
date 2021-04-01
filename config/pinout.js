//_________________________ Raspberry Pi _________________________
const coolerRaspPi = { pwm: 12 }
//_________________________ Lighting _________________________
const brakeLight = { r: 2, g: 3, b: 4 }
const lighting = {
    left: { pwm: 6 },
    middle: { pwm: 7 },
    right: { pwm: 5 }
}
//_________________________ Control Panel _________________________
const controlPanel = {
    bttn1: 24,
    bttn2: 25,
    bttn3: 26,
    bttn4: 27,
    bttn5: 28,
}
//_________________________ Axises _________________________
const axises = {
    leftRear: {
        motor: { en: 17, dir: 27, step: 22 },
        encoder: { a: 53, b: 51 }
    },
    leftFront: {
        motor: { en: 21, dir: 20, step: 16 },
        encoder: { a: 45, b: 43 }
    },
    rightFront: {
        motor: { en: 6, dir: 5, step: 13 },
        encoder: { a: 49, b: 47 }
    },
    rightRear: {
        motor: { en: 26, dir: 19, step: 12 },
        encoder: { a: 41, b: 39 }
    }
}
//_________________________ Scanners _________________________
const scanners = {
    scannerFront: { echo: 25, trig: 18, a: 46, b: 48, c: 50, d: 52 },
    scannerRear: { echo: 24, trig: 23, a: 38, b: 40, c: 42, d: 44 }
}
//_________________________ Motherboard _________________________
const motherboard = {
    rj45Left: { yellow: 29, green: 30 },
    rj45Right: { yellow: 31, green: 32 },
    errorDiode: { state: 37 },
    cooler: { pwm: 13 },
    voltageSensor: { read: 'A0' },
    currentSensor: { read: 'A1' },
    dhtSensor: { data: 22 }
}
//****************************************************
module.exports = pinout = {
    coolerRaspPi,
    brakeLight,
    lighting,
    controlPanel,
    axises,
    scanners,
    motherboard
};