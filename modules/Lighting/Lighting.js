const { Module } = require('../Module')
const pinout = require('../../config/pinout').lighting
const arduino = require('../Arduino').arduino
const config = require('../../config/config').LIGHTING
const { inRange, hexToRgb } = require('../../Global/math')
const pixel = require('node-pixel')
const toHex = require('colornames')

class Strip extends Module {
    constructor(len, ...params) {
        super(...params)
        this.hardware = {
            ...this.hardware,
            out: new pixel.Strip({
                board: arduino,
                controller: "FIRMATA",
                strips: [
                    {
                        pin: this.hardware.pinout.pwm,
                        length: len
                    },
                ],
                gamma: config.GAMMA
            })
        }
        this.length = len
        this.intervals = {
            shifting: null,
            dynamicRainbow: null
        }
        this.hardware.out.on("ready", () => this._getReady())
        arduino.repl.inject({ strip: this.hardware.out })
        this._getReady()
    }
    _clearIntervals() {
        clearInterval(this.intervals.shifting)
        clearInterval(this.intervals.dynamicRainbow)
    }
    /**
    * Initialize static lighting at strip.
    * @param color (Array) Basic color at RGB form or color name as string. Example [255,120,0] or 'magenta'.
    * @param byName (Boolean) Mode to convert color from name to RGB form - set TRUE to turn off.
    * */
    static(color, byName) {
        if (this.state === 'ready') {
            let hex = '#'
            if (byName === true) {
                for (let i = 0; i < 3; i++) {
                    if (color[i].toString(16).length < 2)
                        hex += 0
                    hex += color[i].toString(16)
                }
            } else hex = toHex(color)
            this._clearIntervals()
            this.hardware.out.color(hex)
            this.hardware.out.show()
        }
    }
    /**
    * Initialize lighting at strip with animation based at shifting diodes. Able to use shade modes.
    * @param color (Array) Basic color at RGB form or color name as string. Example [255,120,0] or 'magenta'.
    * @param shades (Array) Configuration shade mode. Example: [0,1,0].
    * @param byName (Boolean) Mode to convert color from name to RGB form - set TRUE to turn off.
    * */
    shifting(color, shades, byName) {
        if (this.state === 'ready') {
            let rgb = color
            if (byName === (false || undefined)) {
                if (typeof (color) != 'string') {
                    this._message(`Wrong color parameter [${color}] at input - detected [${typeof (color)}], expected [string]. Function shifting() has been aborted.`)
                    return
                }
                try { rgb = hexToRgb(toHex.get(color).value) }
                catch (error) {
                    this._message(`Detected unknown color name [${color}] in byName mode. Function shifting() has been aborted. ${error.message}.`)
                    return
                }
            }
            this._clearIntervals()
            let outColors = []
            outColors.push([], [], [])
            //Create array with similar colors for both directions, based at shades' configuration
            for (let i = 0; i < this.length; i++)
                for (let j = 0; j < 3; j++)
                    if (shades[j] === 1 && i != 0) {
                        if (outColors[j].length < this.length) {
                            outColors[j].push(inRange(rgb[j] - i * config.DIFFERENT_AT_SHADE, { min: 0, limit: true }))
                            outColors[j].push(inRange(rgb[j] + i * config.DIFFERENT_AT_SHADE, { max: 255, limit: true }))
                        }
                    } else outColors[j].push(rgb[j])
            let parts = []
            for (let i = 0; i < 3; i++)
                outColors[i].sort((a, b) => { return b - a })
            //Add missing second char, if required, create array with prepared parts
            let hex = ''
            outColors.map((x, idx) => {
                parts.push([])
                x.map(y => {
                    y.toString(16).length < 2 ? hex += '0' + y.toString(16) : hex += y.toString(16)
                    parts[idx].push(hex)
                    hex = ''
                })
            })
            //Set individual colors for diodes
            for (let i = 0; i < this.length; i++)
                this.hardware.out.pixel(i).color('#'.concat(parts[0][i], parts[1][i], parts[2][i]))
        }
        this.intervals.shifting = setInterval(
            () => {
                this.hardware.out.shift(1, pixel.FORWARD, true);
                this.hardware.out.show();
            }, config.SHIFTING_INTERVAL);
    }
    /**
    * Initialize lighting at single diode at strip by diode's ID.
    * @param diode (UInt) Identification number of diode starting from 0 up to length of strip minus one. Example: 6
    * @param color (Array/String) Basic color at RGB form or color name as string. Example [255,120,0] or 'magenta'.
    * @param byName (Boolean) Mode to convert color from name to RGB form - set TRUE to turn off.
    * */
    custom(diode, color, byName) {
        if (this.state === 'ready') {
            if (diode >= this.length) {
                console.log(`Diode's ID [${diode}] out of strip's size [${this.length}]. Function custom() has been aborted.`)
                return
            }
            let rgb = color
            if (byName === (false || undefined)) {
                if (typeof (color) != 'string') {
                    this._message(`Wrong color parameter [${color}] at input - detected [${typeof (color)}], expected [string]. Function shifting() has been aborted.`)
                    return
                }
                try { rgb = hexToRgb(toHex.get(color).value) }
                catch (error) {
                    this._message(`Detected unknown color name [${color}] in byName mode. Function custom() has been aborted. ${error.message}.`)
                    return
                }
            }
            this._clearIntervals()
            this.hardware.out.pixel(diode).color(rgb)
        }
    }
    /**
    * Initialize dynamic lighting rainbow.
    * */
    dynamicRainbow() {
        let showColor;
        let cwi = 0; // colour wheel index (current position on colour wheel)
        this._clearIntervals()
        this.intervals.dynamicRainbow = setInterval(() => {
            if (++cwi > 255) { cwi = 0 }
            for (let i = 0; i < this.length; i++) {
                showColor = this._colorWheel((cwi + i) & 255)
                this.hardware.out.pixel(i).color(showColor)
            }
            this.hardware.out.show()
        }, config.DYNAMIC_RAINBOW_DELAY)
    }
    /**
    * Initialize static lighting rainbow.
    * */
    staticRainbow() {
        let showColor
        for (let i = 0; i < this.length; i++) {
            showColor = this._colorWheel((i * 256 / strip.length) & 255)
            this.hardware.out.pixel(i).color(showColor)
        }
        this.hardware.out.show()
    }
    _colorWheel(WheelPos) {
        var r, g, b
        WheelPos = 255 - WheelPos
        if (WheelPos < 85) {
            r = 255 - WheelPos * 3
            g = 0
            b = WheelPos * 3
        } else if (WheelPos < 170) {
            WheelPos -= 85
            r = 0
            g = WheelPos * 3
            b = 255 - WheelPos * 3
        } else {
            WheelPos -= 170
            r = WheelPos * 3
            g = 255 - WheelPos * 3
            b = 0
        }
        return "rgb(" + r + "," + g + "," + b + ")";
    }
}


leftLight = new Strip(config.LEFT_STRIP_LENGTH, 'Left Light', pinout.left)
middleLight = new Strip(config.MIDDLE_STRIP_LENGTH, 'Middle Light', pinout.middle)
rightLight = new Strip(config.RIGHT_STRIP_LENGTH, 'Right Light', pinout.right)

module.exports = {
    leftLight: leftLight,
    middleLight: middleLight,
    rightLight: rightLight
}