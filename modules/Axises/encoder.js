const { ENCODER, WHEELS_RADIUS } = require('../../config/config').AXISES
const { inRange } = require('../../global/math')


const { FOLDER } = require('../../config/config').RESEARCH
const fs = require('fs')

class Encoder {
    constructor(axis, upButton, downButton) {
        this.axis = axis
        this.upButton = upButton
        this.downButton = downButton
        this.timeAtPrevPos = Date.now()
        this.velocity = 0.0
        this.history = []
        this.upButton.on('up', () => this._measureSpeed())
        this.downButton.on('up', () => this._measureSpeed())
    }
    _measureSpeed() {
        let currentTime = Date.now()
        let diffTime = currentTime - this.timeAtPrevPos
        if (inRange(diffTime, { min: ENCODER.MIN_TIME, max: ENCODER.MAX_TIME })) {
            //v = 3/25 Pi * R * 60/t [km/h]
            //v = (2 * Pi * R) / T = (2 * Pi * R) / (20 * t_dif) [m/s] =
            //  = ((2 * Pi * R) / (20 * t_dif) * 3.6 [km/h]
            //this.velocity = (Math.PI * WHEELS_RADIUS * 7200 / diffTime).toFixed(2)
            this.velocity = (((2 * Math.PI * WHEELS_RADIUS) / (20 * diffTime * 0.001)) * 3.6).toFixed(2)
            if (inRange(this.velocity,
                {
                    min: this.axis.velocity.speed * 0.8, //-20%
                    max: this.axis.velocity.speed * 1.2 //+20%
                })) {
                this.history.push(this.velocity)
                //this.axis._message(`measured ${this.velocity} based at diffTime ${diffTime} -> able from ${(this.axis.velocity.speed * 0.8).toFixed(2)} to ${(this.axis.velocity.speed * 1.2).toFixed(2)}, set ${this.axis.velocity.speed}.`)
                //this.axis._message(`Current velocity is equal ${this.velocity} km/h. Difference time was equal ${diffTime}.`)
                if (this.history.length === 50) this.saveResearch()
                else if (this.history.length < 50) this.axis._message(`current data: ${this.history.length}.`)
            }
        }
        this.timeAtPrevPos = currentTime
    }
    saveResearch() {
        let str = JSON.stringify(this.history)
        let str1 = str.replace(/{|}|\[|\]|"|:/g, '')
        let str2 = str1.replace(/,/g, '	')
        let str3 = str2.replace(/\./g, ',')
        fs.writeFile(FOLDER + '/Encoder ' + this.axis.name + '.txt', str3, 'utf8', error => { })
        console.log('Saved data of encoder ' + this.axis.name)
    }
}

module.exports = Encoder

//Possible to use Gray-Code system to fix problem with failed impulse at modes changes