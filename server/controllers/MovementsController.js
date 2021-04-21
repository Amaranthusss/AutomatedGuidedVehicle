const { ACCELERATION } = require('../../config/config').AXISES
var { controls, states } = require('../../modules/Axises/controllerStates')
const controller = require('../../modules/Axises/Axises')

function getForwardCmd(req, res) {
    controls[0] = req.body.state
    updateCtrl()
    res.end('Post done')
}
function getBackwardCmd(req, res) {
    controls[1] = req.body.state
    updateCtrl()
    res.end('Post done')
}
function getLeftCmd(req, res) {
    controls[2] = req.body.state
    updateCtrl()
    res.end('Post done')
}
function getRightCmd(req, res) {
    controls[3] = req.body.state
    updateCtrl()
    res.end('Post done')
}
function getMaxSpeedCmd(req, res) {
    states.maxSpeed = !req.body.state
    res.end('Post done')
}
function getStopAcceleratingCmd(req, res) {
    states.stopAccelerating = req.body.state
    res.end('Post done')
}
var interval
function updateCtrl() {
    clearInterval(interval)
    let stopTest = controls.find(el => el == true)
    if (stopTest === false)
        controller.stop()
    else {
        switch (controls.join()) { //[up, down, left, right]
            case [true, false, false, false].join():
                interval = setInterval(() => { controller.goForward() }, ACCELERATION); break
            case [false, false, true, false].join():
                interval = setInterval(() => { controller.turnLeft() }, ACCELERATION); break
            case [false, false, false, true].join():
                interval = setInterval(() => { controller.turnRight() }, ACCELERATION); break
            case [true, false, true, false].join():
                interval = setInterval(() => { controller.goLeft() }, ACCELERATION); break
            case [true, false, false, true].join():
                interval = setInterval(() => { controller.goRight() }, ACCELERATION); break
            case [false, true, false, false].join():
                interval = setInterval(() => { controller.goBackward() }, ACCELERATION); break
            case [false, true, true, false].join():
                interval = setInterval(() => { controller.reverseLeft() }, ACCELERATION); break
            case [false, true, false, true].join():
                interval = setInterval(() => { controller.reverseRight() }, ACCELERATION); break
            default:
                controller.stop(); break
        }
    }
    console.log('controls', controls)
}

module.exports = {
    getForwardCmd,
    getBackwardCmd,
    getLeftCmd,
    getRightCmd,
    getMaxSpeedCmd,
    getStopAcceleratingCmd
}