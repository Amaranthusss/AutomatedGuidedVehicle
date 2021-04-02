const controller = require('../../modules/Axises/Axises')

const controls = [0, 0, 0, 0]

function getForwardCmd(req, res) {
    controls.forward = req.body.state
    updateCtrl()
    res.end('Post done')
}
function getBackwardCmd(req, res) {
    controls.backward = req.body.state
    updateCtrl()
    res.end('Post done')
}
function getLeftCmd(req, res) {
    controls.left = req.body.state
    updateCtrl()
    res.end('Post done')
}
function getRightCmd(req, res) {
    controls.right = req.body.state
    updateCtrl()
    res.end('Post done')
}
function updateCtrl() {
    let stopTest = controls.find(el => el == true)
    if (stopTest === false)
        controller.stop()
    else {
        switch (controls) { //[up, left, right, down]
            case [1, 0, 0, 0]:
                controller.goForward()
                break
            case [0, 1, 0, 0]:
                controller.turnLeft()
                break
            case [0, 0, 1, 0]:
                controller.turnRight()
                break
            case [1, 1, 0, 0]:
                controller.goLeft()
                break
            case [1, 0, 1, 0]:
                controller.goRight()
                break
            case [0, 0, 0, 1]:
                controller.goBackward()
                break
            case [0, 1, 0, 1]:
                controller.reverseLeft()
                break
            case [0, 0, 1, 1]:
                controller.reverseRight()
                break
            default:
                controller.stop()
                break
        }
    }

}

module.exports = {
    getForwardCmd,
    getBackwardCmd,
    getLeftCmd,
    getRightCmd
}